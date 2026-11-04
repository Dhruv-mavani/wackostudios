import { EMAIL, SERVICES } from "./data";
import { emailAttachments, renderOwnerEmail, renderVisitorEmail, type Booking } from "./bookingEmail";
import { bookingError, bookingLabel, istNow } from "./booking";
import { EMAIL_ERROR, isValidEmail, normalizeEmail } from "./validate";

/**
 * Validates a meeting request and emails it, fully branded, through Resend. Shared by the "Request this slot" form
 * (/api/book) and the chat bot, so both follow exactly the same rules.
 * Env (set in Vercel and .env.local, never in the page):
 *   RESEND_API_KEY        required. Without it nothing can be sent (503).
 *   BOOKING_TO_EMAIL      where requests go. Defaults to the agency email. With Resend's test sender this must be
 *                         the same address the Resend account was created with.
 *   BOOKING_FROM_EMAIL    sender. Defaults to Resend's shared test sender; use your own verified domain when you have one.
 *   BOOKING_CONFIRM_FROM  optional. If set (a sender on a verified domain), visitors who gave an email also get a
 *                         branded confirmation.
 */
const TOPICS = new Set(["Not sure yet", ...SERVICES.map((s) => s.n)]);

export const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "");

async function send(key: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) console.error("Resend rejected an email", res.status, await res.text().catch(() => ""));
  return res.ok;
}

export type BookingResult = { ok: true } | { ok: false; status: number; error?: string; reason?: string };

export async function submitBooking(input: Record<string, unknown>, via = ""): Promise<BookingResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, status: 503, reason: "not_configured" };

  const date = clean(input.date, 10), time = clean(input.time, 8);
  const b: Booking = {
    name: clean(input.name, 80),
    brand: clean(input.brand, 80),
    email: normalizeEmail(clean(input.email, 254)),
    topic: clean(input.topic, 80),
    notes: [via, clean(input.notes, 1500)].filter(Boolean).join(" ").slice(0, 1500),
    date, time,
    label: bookingLabel(date, time),
  };
  if (!b.name) return { ok: false, status: 400, error: "Please add your name." };
  if (!isValidEmail(b.email)) return { ok: false, status: 400, error: EMAIL_ERROR };
  // Same rules as the date picker: no past days, no closed days, nothing beyond the booking window, today needs notice.
  const slotErr = bookingError(date, time, istNow());
  if (slotErr) return { ok: false, status: 400, error: slotErr };
  if (!TOPICS.has(b.topic)) b.topic = "Not sure yet";

  const to = process.env.BOOKING_TO_EMAIL || EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL || "Wacko Studios <onboarding@resend.dev>";
  const owner = renderOwnerEmail(b);
  const delivered = await send(key, { from, to: [to], subject: owner.subject, html: owner.html, text: owner.text, reply_to: b.email, attachments: emailAttachments() });
  if (!delivered) return { ok: false, status: 502, reason: "send_failed" };

  // Optional confirmation to the visitor; never blocks or fails the request.
  const confirmFrom = process.env.BOOKING_CONFIRM_FROM;
  if (confirmFrom) {
    const v = renderVisitorEmail(b);
    await send(key, { from: confirmFrom, to: [b.email], reply_to: EMAIL, subject: v.subject, html: v.html, text: v.text, attachments: emailAttachments() });
  }
  return { ok: true };
}
