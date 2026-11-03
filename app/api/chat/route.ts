import { EMAIL } from "@/lib/data";
import { CHAT_LIMITS, SHOW_CHATBOT, type ChatMessage } from "@/lib/chatbot";
import { LEAD_TOOL, renderLeadEmail, systemPrompt, type Lead } from "@/lib/chatServer";
import { attempts, type RunTool } from "@/lib/chatProviders";
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
 * When a visitor agrees to be contacted the model calls save_lead, which emails the team through the same Resend setup as
 * the booking form (RESEND_API_KEY, BOOKING_TO_EMAIL, BOOKING_FROM_EMAIL).
 */
// Best-effort throttle (per serverless instance): 20 messages per 10 minutes per IP.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "");

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

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return Response.json({ ok: false, error: "You are sending messages quickly. Please wait a few minutes." }, { status: 429 });

  // Only the text of recent user and assistant turns is accepted; anything else is dropped.
  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages: ChatMessage[] = raw
    .map((m: { role?: unknown; content?: unknown }) => ({ role: m?.role === "assistant" ? "assistant" as const : "user" as const, content: clean(m?.content, CHAT_LIMITS.chars) }))
    .filter((m) => m.content)
    .slice(-CHAT_LIMITS.turns);
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return Response.json({ ok: false, error: "Say something first." }, { status: 400 });

  const transcript = messages.map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`).join("\n");
  // One lead per visit, even if a later model has to retry the conversation from the start.
  let leadSaved = false;
  const runTool: RunTool = async (name, input) => {
    if (name !== LEAD_TOOL.name) return { ok: false, message: "Unknown tool." };
    if (leadSaved) return { ok: true, message: "Already sent to the team." };
    const out = await saveLead(input, transcript);
    if (out.ok) leadSaved = true;
    return out;
  };

  const system = systemPrompt();
  for (const m of models) {
    try {
      const reply = await m.run(messages, system, runTool);
      return Response.json({ ok: true, reply, leadSaved });
    } catch (e) {
      console.error(`Chat model ${m.label} failed, trying the next one`, e instanceof Error ? e.message : e);
    }
  }
  return Response.json({ ok: false, reason: "model_failed" }, { status: 502 });
}
