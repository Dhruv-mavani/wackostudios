import { renderOwnerEmail, renderVisitorEmail, type Booking } from "@/lib/bookingEmail";

/** Development only: GET /api/book/preview?kind=owner|visitor&who=email|phone shows the email design without sending. */
export function GET(req: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const q = new URL(req.url).searchParams;
  const sample: Booking = {
    name: "Aarav Mehta",
    contact: q.get("who") === "phone" ? "+91 98765 43210" : "aarav@brandstudio.in",
    topic: "Performance Marketing",
    notes: "We run a D2C skincare brand and want help scaling paid ads before the festive season.\nBudget is flexible. Can we also talk about a landing page?",
    date: "2026-10-30",
    time: "2:00 PM",
    label: "Fri 30 Oct, 2:00 PM IST",
  };
  const mail = q.get("kind") === "visitor" ? renderVisitorEmail(sample) : renderOwnerEmail(sample);
  return new Response(mail.html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
