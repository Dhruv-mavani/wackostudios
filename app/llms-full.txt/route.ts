import { SERVICES } from "@/lib/data";
import { FAQ, SITE, SITE_URL } from "@/lib/seo";

export function GET() {
  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.tagline}

Wacko Studios puts content, campaigns, branding and code under one roof. Website: ${SITE_URL}/

## Services
${SERVICES.map((s) => `### ${s.n}\n${s.d} Includes: ${s.c.join(", ")}.`).join("\n\n")}

## How to work with us
Book a free 30 minute intro call (video or phone, times in IST) at ${SITE_URL}/#book, or contact the team directly.
- Email: ${SITE.email}
- Phone and WhatsApp: ${SITE.phone}
- Instagram: ${SITE.instagram}

## FAQ
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
