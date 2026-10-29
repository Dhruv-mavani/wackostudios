import { EMAIL, SERVICES, TIMES } from "@/lib/data";
import { looksLikeEmail, renderOwnerEmail, renderVisitorEmail, type Booking } from "@/lib/bookingEmail";

/**
 * Receives the "Schedule a meeting" form and emails it, fully branded, through Resend.
 * Env (set in Vercel and .env.local, never in the page):
 *   RESEND_API_KEY        required. Without it this route answers 503 and the page falls back to Web3Forms.
 *   BOOKING_TO_EMAIL      where requests go. Defaults to the agency email. With Resend's test sender this must be
 *                         the same address the Resend account was created with.
 *   BOOKING_FROM_EMAIL    sender. Defaults to Resend's shared test sender; use your own verified domain when you have one.
 *   BOOKING_CONFIRM_FROM  optional. If set (a sender on a verified domain), visitors who gave an email also get a
 *                         branded confirmation.
 */
const TOPICS = new Set(["Not sure yet", ...SERVICES.map((s) => s.n)]);

// Best-effort throttle (per serverless instance): 5 requests per 10 minutes per IP.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "");

async function send(key: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) console.error("Resend rejected an email", res.status, await res.text().catch(() => ""));
  return res.ok;
}

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ ok: false, reason: "not_configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "Bad request." }, { status: 400 }); }

  // Honeypot: pretend success so bots learn nothing.
  if (body.botcheck) return Response.json({ ok: true });

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return Response.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });

  const b: Booking = {
    name: clean(body.name, 80),
    contact: clean(body.contact, 120),
    topic: clean(body.topic, 80),
    notes: clean(body.notes, 1500),
    date: clean(body.date, 10),
    time: clean(body.time, 8),
    label: clean(body.label, 60),
  };
  if (!b.name || !b.contact) return Response.json({ ok: false, error: "Please add your name and an email or phone number." }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date) || !TIMES.includes(b.time) || !b.label) return Response.json({ ok: false, error: "Please choose a day and a time first." }, { status: 400 });
  if (!TOPICS.has(b.topic)) b.topic = "Not sure yet";

  const to = process.env.BOOKING_TO_EMAIL || EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL || "Wacko Studios <onboarding@resend.dev>";
  const owner = renderOwnerEmail(b);
  const delivered = await send(key, {
    from, to: [to], subject: owner.subject, html: owner.html, text: owner.text,
    ...(looksLikeEmail(b.contact) ? { reply_to: b.contact } : {}),
  });
  if (!delivered) return Response.json({ ok: false, reason: "send_failed" }, { status: 502 });

  // Optional confirmation to the visitor; never blocks or fails the request.
  const confirmFrom = process.env.BOOKING_CONFIRM_FROM;
  if (confirmFrom && looksLikeEmail(b.contact)) {
    const v = renderVisitorEmail(b);
    await send(key, { from: confirmFrom, to: [b.contact], reply_to: EMAIL, subject: v.subject, html: v.html, text: v.text });
  }
  return Response.json({ ok: true });
}
