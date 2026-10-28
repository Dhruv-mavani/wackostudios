import type { CSSProperties, ElementType } from "react";

type Part = string | { em: string };

/** Word-by-word reveal heading. The `.in-view` class (added by ScrollEngine) slides each word up. */
export default function Split({ as: Tag = "h2", className, parts }: { as?: ElementType; className?: string; parts: Part[] }) {
  let i = 0;
  const words = (text: string) =>
    text.split(/\s+/).filter(Boolean).flatMap((t) => [
      <span className="w" key={i}>
        <span style={{ "--i": i++ } as CSSProperties}>{t}</span>
      </span>,
      " ",
    ]);
  return (
    <Tag className={className} data-split>
      {parts.map((p, k) => (typeof p === "string" ? <span key={k} style={{ display: "contents" }}>{words(p)}</span> : <em key={k}>{words(p.em)}</em>))}
    </Tag>
  );
}
