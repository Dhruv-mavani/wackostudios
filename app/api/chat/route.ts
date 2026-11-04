import { EMAIL, SERVICES } from "@/lib/data";
import { CHAT_LIMITS, SHOW_CHATBOT, type ChatMessage } from "@/lib/chatbot";
import { BOOK_TOOL, LEAD_TOOL, SLOTS_TOOL, renderLeadEmail, systemPrompt, type Lead } from "@/lib/chatServer";
import { attempts, type RunTool } from "@/lib/chatProviders";
import { MAX_DAYS_AHEAD, bookableDates, bookingError, dayLabel, dayState, isIsoDate, istNow, openTimes } from "@/lib/booking";
import { clean, submitBooking } from "@/lib/bookingServer";
import { BOOKING_LIMIT, BOOKING_LIMIT_MESSAGE, clientIp, overLimit } from "@/lib/rateLimit";
import { isValidEmail, normalizeEmail } from "@/lib/validate";

/**
 * Website chat assistant. The page posts the conversation, this route asks an AI model and returns the reply.
 * The models are tried in order until one answers (see lib/chatProviders.ts). Env (set in Vercel and .env.local, never in the page):
 *   GEMINI_API_KEY          main provider, free tier: https://aistudio.google.com/apikey
 *   GEMINI_MODEL            optional, the main Gemini model
 *   GEMINI_FALLBACK_MODEL   optional, a second Gemini model used when the first fails (it has its own free quota)
 *   ANTHROPIC_API_KEY       optional paid last resort, only used if every Gemini attempt fails
 *   CHAT_MODEL              optional, the Claude model for that last resort
 * With none of the keys this route answers 503 and the chat shows the WhatsApp / email fallback.
 * The model has three tools: list_open_times (which call slots are free), book_slot (sends a meeting request through exactly
 * the same checks, emails and rate limit as the "Request this slot" form, see lib/bookingServer.ts) and save_lead (passes
 * contact details to the team). Email setup: RESEND_API_KEY, BOOKING_TO_EMAIL, BOOKING_FROM_EMAIL.
 * Limits per IP: 20 chat messages and, shared with the booking form, 5 booking requests, each per 10 minutes.
 */
const CHAT_MESSAGES_PER_WINDOW = 20;

/**
 * Pulls the tap-button line ("OPTIONS: a | b | c") off the end of a reply. The special words @services and @days are expanded here
 * from real data, so the buttons are always correct no matter what the model wrote.
 */
function splitOptions(reply: string) {
  const m = /(?:^|\n)\s*OPTIONS:\s*([^\n]*?)\s*$/i.exec(reply);
  if (!m) return { text: reply.replace(/\n?\s*OPTIONS:[\s\S]*$/i, "").trim(), options: [] as string[] };
  const out: string[] = [];
  for (const raw of m[1].split("|")) {
    const o = raw.trim().replace(/^["'*]+|["'*]+$/g, "");
    if (/^@services$/i.test(o)) out.push(...SERVICES.map((s) => s.n), "Not sure yet");
    else if (/^@days$/i.test(o)) out.push(...bookableDates(istNow()).slice(0, 6).map(dayLabel), "Another day");
    else if (o && o.length <= 40) out.push(o);
  }
  return { text: reply.slice(0, m.index).trim(), options: [...new Set(out)].slice(0, 14) };
}

async function saveLead(input: Record<string, unknown>, transcript: string): Promise<{ ok: boolean; message: string }> {
  const key = process.env.RESEND_API_KEY;
  const lead: Lead = {
    name: clean(input.name, 80),
    email: normalizeEmail(clean(input.email, 254)),
    phone: clean(input.phone, 30),
    brand: clean(input.brand, 80),
    interest: clean(input.interest, 120),
    notes: clean(input.notes, 600),
  };
  const digits = lead.phone.replace(/\D/g, "");
  if (!lead.name) return { ok: false, message: "Missing name. Ask for it." };
  if (lead.email && !isValidEmail(lead.email)) return { ok: false, message: "That email looks invalid. Ask the visitor to check it." };
  if (!lead.email && digits.length < 8) return { ok: false, message: "Need a valid email or phone number. Ask for one." };
  if (!key) return { ok: false, message: "Could not send right now. Tell the visitor to use the Book a call button or WhatsApp." };

  const mail = renderLeadEmail(lead, transcript);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BOOKING_FROM_EMAIL || "Wacko Studios <onboarding@resend.dev>",
      to: [process.env.BOOKING_TO_EMAIL || EMAIL],
      subject: mail.subject, html: mail.html, text: mail.text,
      ...(lead.email ? { reply_to: lead.email } : {}),
    }),
  });
  if (!res.ok) {
    console.error("Resend rejected a chat lead", res.status, await res.text().catch(() => ""));
    return { ok: false, message: "Could not send right now. Tell the visitor to use the Book a call button or WhatsApp." };
  }
  return { ok: true, message: "Sent to the team. Tell the visitor they will hear back soon." };
}

export async function POST(req: Request) {
  if (!SHOW_CHATBOT) return new Response("Not found", { status: 404 });
  const models = attempts();
  if (!models.length) return Response.json({ ok: false, reason: "not_configured" }, { status: 503 });

  let body: { messages?: unknown };
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "Bad request." }, { status: 400 }); }

  const ip = clientIp(req);
  if (overLimit("chat", ip, CHAT_MESSAGES_PER_WINDOW)) return Response.json({ ok: false, error: "You are sending messages quickly. Please wait a few minutes." }, { status: 429 });

  // Only the text of recent user and assistant turns is accepted; anything else is dropped.
  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages: ChatMessage[] = raw
    .map((m: { role?: unknown; content?: unknown }) => ({ role: m?.role === "assistant" ? "assistant" as const : "user" as const, content: clean(m?.content, CHAT_LIMITS.chars) }))
    .filter((m) => m.content)
    .slice(-CHAT_LIMITS.turns);
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return Response.json({ ok: false, error: "Say something first." }, { status: 400 });

  const transcript = messages.map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`).join("\n");
  // What the page says this chat has already done. It is only a hint to stop the bot repeating itself; the real protection is the rate limit.
  const done = (body as { done?: { booked?: unknown; lead?: unknown } }).done;
  const state = { booked: done?.booked === true, lead: done?.lead === true };

  // One lead and one booking per visit, even if a later model has to retry the conversation from the start.
  let leadSaved = false, booked = false;
  const runTool: RunTool = async (name, input) => {
    const now = istNow();
    if (name === SLOTS_TOOL.name) {
      const date = clean(input.date, 10);
      if (!isIsoDate(date)) return { ok: false, message: "That is not a valid date. Use YYYY-MM-DD." };
      if (dayState(date, now) !== "ok") return { ok: false, message: bookingError(date, "10:00 AM", now) || "That day cannot be booked." };
      const times = openTimes(date, now);
      return { ok: true, message: `Open times on ${date} (IST): ${times.join(", ")}. Bookings go up to ${MAX_DAYS_AHEAD} days ahead.` };
    }
    if (name === BOOK_TOOL.name) {
      if (booked || state.booked) return { ok: false, message: "A booking request was already sent in this chat. Do not send another; suggest WhatsApp or the Book a call button for changes." };
      // Same limit as the "Request this slot" button: 5 requests per 10 minutes per IP, counted together.
      if (overLimit("booking", ip, BOOKING_LIMIT)) return { ok: false, message: `${BOOKING_LIMIT_MESSAGE} Tell the visitor to wait a few minutes or message the team on WhatsApp.` };
      const out = await submitBooking(input, "Booked through the website chat (Wacky).");
      if (out.ok) { booked = true; return { ok: true, message: "Request sent to the team. Tell the visitor the team will confirm the slot by email. It is not confirmed until then." }; }
      if (out.error) return { ok: false, message: `Not sent: ${out.error} Fix it with the visitor and try again.` };
      return { ok: false, message: "Could not send right now. Tell the visitor to use the Book a call button or WhatsApp." };
    }
    if (name === LEAD_TOOL.name) {
      if (leadSaved || state.lead) return { ok: true, message: "Already sent to the team." };
      const out = await saveLead(input, transcript);
      if (out.ok) leadSaved = true;
      return out;
    }
    return { ok: false, message: "Unknown tool." };
  };

  const system = systemPrompt(istNow(), state);
  for (const m of models) {
    try {
      const reply = await m.run(messages, system, runTool);
      const { text, options } = splitOptions(reply);
      return Response.json({ ok: true, reply: text || reply, options, leadSaved, booked });
    } catch (e) {
      console.error(`Chat model ${m.label} failed, trying the next one`, e instanceof Error ? e.message : e);
    }
  }
  return Response.json({ ok: false, reason: "model_failed" }, { status: 502 });
}
