import { EMAIL, INSTAGRAM_URL, PHONE, SERVICES } from "./data";

// Canonical, sitemap, structured data and email links all follow this. Override with NEXT_PUBLIC_SITE_URL if the domain changes.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://wackostudios.in").replace(/\/$/, "");

export const SITE = {
  name: "Wacko Studios",
  tagline: "Creative marketing for brands that refuse to blend in.",
  description:
    "Wacko Studios is a creative marketing agency in India. Content creation, influencer marketing, performance marketing, branding, video editing and full stack development under one roof.",
  email: EMAIL,
  phone: PHONE,
  phoneE164: "+918733064171",
  instagram: INSTAGRAM_URL.replace("?hl=en", ""),
};

const serviceList = SERVICES.map((s) => s.n.toLowerCase());

/** Visible on the page and mirrored in FAQPage JSON-LD, llms.txt and the agent tools. Keep answers factual and self-contained. */
export const FAQ = [
  {
    q: "What is Wacko Studios?",
    a: "Wacko Studios is a creative marketing agency in India. One team plans, shoots, designs, builds and runs content, campaigns, branding and code, so ideas ship fast and look like nobody else's.",
  },
  {
    q: "What services does Wacko Studios offer?",
    a: `Wacko Studios offers ${serviceList.slice(0, -1).join(", ")} and ${serviceList.at(-1)}. If a brand needs something beyond that list, ask and the team will say whether they can help.`,
  },
  {
    q: "How do I book a call with Wacko Studios?",
    a: `Pick a day and a time (shown in IST) in the scheduler on this page and send the request. It goes straight to the team, who reply to confirm the slot. You can also message on WhatsApp at ${PHONE} or email ${EMAIL}.`,
  },
  {
    q: "Is the intro call free?",
    a: "Yes. The intro call is 30 minutes on video or phone, it is free, and it ends with a clear next step. There is no long pitch and no pressure.",
  },
  {
    q: "Does Wacko Studios build websites and web apps?",
    a: "Yes. Full Stack Development covers fast websites, landing pages, web apps and integrations, designed and built end to end by the same team that handles the marketing.",
  },
  {
    q: "Does Wacko Studios run paid ads and generate leads?",
    a: "Yes. Performance Marketing runs paid campaigns on Meta and Google, tuned weekly against the numbers that matter. Lead Generation builds funnels, landing pages and campaigns that bring in people who want to talk.",
  },
  {
    q: "How can I contact Wacko Studios?",
    a: `Email ${EMAIL}, call or WhatsApp ${PHONE}, or message @wackostudios.in on Instagram (${INSTAGRAM_URL.replace("?hl=en", "")}).`,
  },
] as const;

export function jsonLd() {
  const org = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    url: SITE_URL,
    description: SITE.description,
    slogan: SITE.tagline,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 1578, height: 549 },
    image: `${SITE_URL}/opengraph-image.png`,
    email: SITE.email,
    telephone: SITE.phoneE164,
    sameAs: [SITE.instagram],
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: SERVICES.map((s) => s.n),
    contactPoint: [
      { "@type": "ContactPoint", contactType: "sales", email: SITE.email, telephone: SITE.phoneE164, availableLanguage: ["English", "Hindi"], areaServed: "IN" },
    ],
    makesOffer: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.n, description: s.d, provider: { "@id": `${SITE_URL}/#organization` } } })),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE.name, description: SITE.description, inLanguage: "en-IN", publisher: { "@id": `${SITE_URL}/#organization` } },
      { "@type": "WebPage", "@id": `${SITE_URL}/#webpage`, url: SITE_URL, name: `${SITE.name} | Creative marketing agency`, isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": `${SITE_URL}/#organization` }, inLanguage: "en-IN" },
      { "@type": "FAQPage", "@id": `${SITE_URL}/#faq`, mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
}
