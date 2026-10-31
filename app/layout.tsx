import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import Loader from "@/components/Loader";
import { SITE, SITE_URL } from "@/lib/seo";
import "./globals.css";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Short on purpose: chat apps cut link-preview descriptions off after a line or two.
const PREVIEW = "Content, campaigns, branding and code under one roof. Creative marketing for brands that refuse to blend in.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Wacko Studios | Creative marketing agency in India", template: "%s | Wacko Studios" },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["creative marketing agency India", "content creation", "influencer marketing", "performance marketing", "branding", "video editing", "graphic design", "lead generation", "full stack development", "Wacko Studios"],
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Marketing agency",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: SITE.name, title: "Wacko Studios | Creative marketing agency in India", description: PREVIEW, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: "Wacko Studios | Creative marketing agency in India", description: PREVIEW },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  // Regional hints for search engines and AI crawlers.
  other: { "geo.region": "IN", "geo.placename": "India", "content-language": "en-IN" },
  formatDetection: { telephone: true, email: true },
};

export const viewport: Viewport = { viewportFit: "cover", themeColor: "#113462" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`js is-loading ${poppins.variable} ${montserrat.variable}`}>
      <body>
        <Loader />
        {children}
        {/* Without JS the loading screen can never finish, so skip it and show the page. */}
        <noscript>
          <style>{`html.is-loading:has(#intro){overflow:auto}html.is-loading:has(#intro) .logo-pulse,html.is-loading:has(#intro) .stage-glow{animation:none}html.is-loading:has(#intro) .stage-bg{opacity:1}html.is-loading:has(#intro) .fw,html.is-loading:has(#intro) main>*{visibility:visible}html.is-loading:has(#intro) :is(.fw,.tagline,.cue){animation-play-state:running}html.is-loading:has(#intro) .rail{opacity:1}html.is-loading:has(#intro) .nav{opacity:1;transform:translateX(-50%)}`}</style>
        </noscript>
      </body>
    </html>
  );
}
