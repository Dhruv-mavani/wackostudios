import Image from "next/image";
import { CLIENTS } from "@/lib/data";
import Split from "./Split";

const ROWS = [CLIENTS.slice(0, 10), CLIENTS.slice(10)];

/** One scrolling row. ScrollEngine measures the track as 4 identical sets, so keep the repeat count at 4. */
function Row({ logos, dir }: { logos: typeof CLIENTS; dir: -1 | 1 }) {
  return (
    <div className="mq" aria-hidden="true">
      <div className="mq-track" data-mq data-dir={dir} data-speed="0.55">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} style={{ display: "contents" }}>
            {logos.map((c) => (
              <div className="logo-tile" key={c.name}>
                <Image src={c.logo} alt="" width={c.w} height={c.h} loading="eager" />
              </div>
            ))}
          </span>
        ))}
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
        <ul className="sr-only">{CLIENTS.map((c) => <li key={c.name}>{c.name}</li>)}</ul>
      </div>
      <Row logos={ROWS[0]} dir={-1} />
      <Row logos={ROWS[1]} dir={1} />
    </section>
  );
}
