import { CLIENTS, MARKS, SHOW_SAMPLE_TAGS } from "@/lib/data";
import Split from "./Split";

function Row({ idx, dir }: { idx: 0 | 1; dir: -1 | 1 }) {
  const off = idx * 6;
  const tiles = CLIENTS.slice(0, 6).map((_, i) => {
    const j = (i + off) % CLIENTS.length;
    return (
      <div className="logo-tile" key={i}>
        <svg viewBox="0 0 40 40" aria-hidden="true" dangerouslySetInnerHTML={{ __html: MARKS[(i + off) % MARKS.length]("currentColor") }} />
        {CLIENTS[j].name}
      </div>
    );
  });
  return (
    <div className="mq" aria-hidden="true">
      <div className="mq-track" data-mq data-dir={dir} data-speed="0.55">
        {Array.from({ length: 6 }, (_, k) => <span key={k} style={{ display: "contents" }}>{tiles}</span>)}
      </div>
    </div>
  );
}

export default function Clients() {
  return (
    <section className="clients" id="clients" aria-label="Brands we have worked with">
      <div className="in">
        <p className="eyebrow">Brands &amp; companies</p>
        <Split parts={["Brands that took the leap."]} />
        <p className="lead rv" style={{ color: "var(--ink-dim)" }}>A few of the brands and companies we have had the pleasure of working with.</p>
      </div>
      <Row idx={0} dir={-1} />
      <Row idx={1} dir={1} />
      <div className="in"><p className="note">{SHOW_SAMPLE_TAGS ? "Placeholder logos shown. Real client logos will replace these." : ""}</p></div>
    </section>
  );
}
