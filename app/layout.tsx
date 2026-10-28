import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Wacko Studios",
  description: "Wacko Studios is a creative marketing agency: content, campaigns, branding and code under one roof.",
  icons: { icon: "/logo.png" },
};

export const viewport: Viewport = { viewportFit: "cover", themeColor: "#172033" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`js ${poppins.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
