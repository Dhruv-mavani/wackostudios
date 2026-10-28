import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { preload } from "react-dom";
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
  // The logo is the LCP element but is a CSS background, so the browser would not discover it early on its own.
  preload("/logo-white.webp", { as: "image", fetchPriority: "high" });
  return (
    <html lang="en-IN" className={`js ${poppins.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
