import { SERVICES } from "@/lib/data";
import { SITE, SITE_URL } from "@/lib/seo";

// llms.txt: a short, markdown summary for AI assistants. Full answers live in /llms-full.txt.
export function GET() {
  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.tagline} Based in India. Free 30 minute intro calls, times in IST.

## Pages
- [Home](${SITE_URL}/): services, work, clients, booking and contact in one scrolling page
- [Services](${SITE_URL}/#services): ${SERVICES.map((s) => s.n).join(", ")}
- [Book a call](${SITE_URL}/#book): pick a day and time for a free 30 minute call
- [FAQ](${SITE_URL}/#faq): common questions, answered
- [Contact](${SITE_URL}/#contact): email, phone and WhatsApp, Instagram

## Contact
- Email: ${SITE.email}
- Phone and WhatsApp: ${SITE.phone}
- Instagram: ${SITE.instagram}

## Optional
- [Full details](${SITE_URL}/llms-full.txt): services and FAQ in full
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
