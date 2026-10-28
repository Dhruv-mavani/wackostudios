import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { preload } from "react-dom";
import Loader from "@/components/Loader";
import { SITE, SITE_URL } from "@/lib/seo";
import "./globals.css";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

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
  openGraph: { type: "website", url: "/", siteName: SITE.name, title: "Wacko Studios | Creative marketing agency in India", description: SITE.tagline + " " + SITE.description, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: "Wacko Studios | Creative marketing agency in India", description: SITE.tagline },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  // Regional hints for search engines and AI crawlers.
  other: { "geo.region": "IN", "geo.placename": "India", "content-language": "en-IN" },
  formatDetection: { telephone: true, email: true },
};

export const viewport: Viewport = { viewportFit: "cover", themeColor: "#172033" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  // The loading screen's logo is the first paint; preload it so it appears immediately.
  preload("/logo.webp", { as: "image", fetchPriority: "high" });
  return (
    <html lang="en-IN" className={`js is-loading ${poppins.variable} ${montserrat.variable}`}>
      <body>
        <Loader />
        {children}
        {/* Without JS the loading screen can never finish, so skip it and show the page. */}
        <noscript>
          <style>{`.loader{display:none}html.is-loading{overflow:auto}html.is-loading main,html.is-loading .rail{opacity:1;transform:none}html.is-loading .nav{opacity:1;transform:translateX(-50%)}html.is-loading :is(.slice,.wedge-fly,.tagline,.cue){animation-play-state:running}`}</style>
        </noscript>
      </body>
    </html>
  );
}
