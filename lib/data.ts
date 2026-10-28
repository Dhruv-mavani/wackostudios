/* ===== EDIT YOUR CONTENT HERE ===== */
export const SHOW_SAMPLE_TAGS = true; // set to false once real projects and client logos are added

export const SERVICES = [
  { n: "Content Creation", d: "Reels, shoots and posts built to be watched, saved and shared.", c: ["Reels", "Photography", "Copy"], i: "content" },
  { n: "Influencer Marketing", d: "The right creators, briefed well, so the audience trusts the message.", c: ["Creator sourcing", "Campaigns", "Reporting"], i: "influencer" },
  { n: "Performance Marketing", d: "Paid campaigns on Meta and Google, tuned weekly against the numbers that matter.", c: ["Meta Ads", "Google Ads", "Analytics"], i: "perf" },
  { n: "Full Stack Development", d: "Fast websites, landing pages and web apps, designed and built end to end.", c: ["Websites", "Web apps", "Integrations"], i: "dev" },
  { n: "Content Planning", d: "Calendars, themes and scripts mapped out ahead, so posting never turns into panic.", c: ["Calendars", "Scripts", "Strategy"], i: "plan" },
  { n: "Creative Ad Campaigns", d: "Big ideas and bold ads that stop the thumb and earn the click.", c: ["Concepts", "Ad creative", "Launch"], i: "ads" },
  { n: "Branding", d: "Names, logos, voice and visual systems that make a brand instantly recognisable.", c: ["Identity", "Voice", "Guidelines"], i: "brand" },
  { n: "Graphic Design", d: "Social creatives, posters, decks and packaging with a point of view.", c: ["Social", "Print", "Decks"], i: "graphic" },
  { n: "Video Editing", d: "Cuts, captions and motion that keep people watching to the last second.", c: ["Reels", "Ads", "Motion"], i: "video" },
  { n: "Lead Generation", d: "Funnels, landing pages and campaigns that fill your inbox with people who want to talk.", c: ["Funnels", "Forms", "Nurture"], i: "lead" },
];

export const WORK = [
  { client: "Client name", title: "Launch reel series", d: "A short-form video series and creator push built around a product launch.", c: ["Content Creation", "Influencer Marketing"], bg: "#E66A2C", fg: "#172033", panel: "#172033", art: "reel" },
  { client: "Client name", title: "Identity refresh", d: "A new logo, colour system, voice and a social template kit.", c: ["Branding", "Graphic Design"], bg: "#FFFFFF", fg: "#172033", panel: "#E66A2C", art: "brand" },
  { client: "Client name", title: "Always-on growth", d: "Paid campaigns tied to a lead funnel, with weekly reporting.", c: ["Performance Marketing", "Lead Generation"], bg: "#263454", fg: "#FFFFFF", panel: "#FFFFFF", art: "perf" },
  { client: "Client name", title: "Brand website", d: "A fast marketing site with booking and lead capture built in.", c: ["Full Stack Development"], bg: "#F4F4F4", fg: "#172033", panel: "#172033", art: "web" },
  { client: "Client name", title: "Festive ad set", d: "A set of cut-down ads and reels for a seasonal push.", c: ["Creative Ad Campaigns", "Video Editing"], bg: "#E66A2C", fg: "#172033", panel: "#172033", art: "video" },
];

export const CLIENTS = Array.from({ length: 12 }, (_, i) => ({ name: "Client " + String(i + 1).padStart(2, "0") }));
export const TIMES = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

export const WA = "918733064171";
export const EMAIL = "wackostudiosindia@gmail.com";
export const PHONE = "+91 8733064171";
export const INSTAGRAM_URL = "https://www.instagram.com/wackostudios.in/?hl=en";

export const MARKS: ((c: string) => string)[] = [
  (c) => `<circle cx="20" cy="20" r="16" fill="${c}"/><circle cx="20" cy="20" r="6" fill="#E66A2C"/>`,
  (c) => `<rect x="5" y="5" width="30" height="30" rx="8" fill="${c}"/><path d="M13 27L27 13" stroke="#E66A2C" stroke-width="5" stroke-linecap="round"/>`,
  (c) => `<path d="M20 4L36 34H4z" fill="${c}"/><circle cx="20" cy="26" r="5" fill="#E66A2C"/>`,
  (c) => `<path d="M20 3l15 9v16l-15 9-15-9V12z" fill="${c}"/><path d="M20 12v16" stroke="#E66A2C" stroke-width="5" stroke-linecap="round"/>`,
  (c) => `<circle cx="20" cy="20" r="14" fill="none" stroke="${c}" stroke-width="7"/><circle cx="29" cy="11" r="4.5" fill="#E66A2C"/>`,
  (c) => `<path d="M20 3l17 17-17 17L3 20z" fill="${c}"/><rect x="15" y="15" width="10" height="10" rx="2" fill="#E66A2C"/>`,
];
