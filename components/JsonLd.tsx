import { jsonLd } from "@/lib/seo";

export default function JsonLd() {
  // "<" is escaped so the payload can never close the script tag.
  const json = JSON.stringify(jsonLd()).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
