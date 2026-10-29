import type { Metadata } from "next";
import ThankYou from "@/components/ThankYou";

// The page visitors land on after the scheduler sends their request. Also used as the conversion URL for ad platforms.
export const metadata: Metadata = {
  title: "Thank you",
  description: "Your meeting request has been sent to Wacko Studios.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYou />;
}
