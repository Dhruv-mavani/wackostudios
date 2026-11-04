import { submitBooking } from "@/lib/bookingServer";
import { BOOKING_LIMIT, BOOKING_LIMIT_MESSAGE, clientIp, overLimit } from "@/lib/rateLimit";

/**
 * Receives the "Schedule a meeting" form. Validation, the branded emails and the env vars are in lib/bookingServer.ts, which the
 * chat bot uses too. Without RESEND_API_KEY this route answers 503 and the page falls back to Web3Forms.
 */
export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) return Response.json({ ok: false, reason: "not_configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "Bad request." }, { status: 400 }); }

  // Honeypot: pretend success so bots learn nothing.
  if (body.botcheck) return Response.json({ ok: true });

  if (overLimit("booking", clientIp(req), BOOKING_LIMIT)) return Response.json({ ok: false, error: BOOKING_LIMIT_MESSAGE }, { status: 429 });

  const result = await submitBooking(body);
  if (result.ok) return Response.json({ ok: true });
  return Response.json({ ok: false, ...(result.error ? { error: result.error } : { reason: result.reason }) }, { status: result.status });
}
