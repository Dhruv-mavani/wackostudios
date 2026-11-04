/**
 * Best-effort throttle kept in server memory (per serverless instance, so it resets when an instance restarts and is not shared
 * between instances): a rolling window per bucket and IP. Returns true once an IP has gone over `max` hits in `windowMs`.
 * Every call counts as a hit, including ones that end up rejected.
 */
const buckets = new Map<string, Map<string, number[]>>();

export function overLimit(bucket: string, ip: string, max: number, windowMs = 10 * 60_000) {
  const now = Date.now();
  const hits = buckets.get(bucket) ?? new Map<string, number[]>();
  buckets.set(bucket, hits);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > max;
}

export const clientIp = (req: Request) => (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();

/** Booking requests, from the form and from the chat bot together: 5 per 10 minutes per IP. */
export const BOOKING_LIMIT = 5;
export const BOOKING_LIMIT_MESSAGE = "Too many requests. Please try again in a few minutes.";
