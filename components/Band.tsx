import { SERVICES } from "@/lib/data";

/** Scrolling text band. ScrollEngine drives the track (data-mq) and speeds it up with scroll velocity. */
export default function Band({ variant, rev, dir, style }: { variant: "navy" | "orange"; rev?: boolean; dir: -1 | 1; style?: React.CSSProperties }) {
  const set = SERVICES.map((s) => (
    <span key={s.n}>{s.n}<svg><use href="#wedge" /></svg></span>
  ));
  return (
    <div className={`band ${variant}${rev ? " rev" : ""}`} aria-hidden="true" style={style}>
      <div className="mq-track" data-mq data-dir={dir} data-speed="0.7">
        {[0, 1, 2, 3].map((k) => <span key={k} style={{ display: "contents" }}>{set}</span>)}
      </div>
    </div>
  );
}
