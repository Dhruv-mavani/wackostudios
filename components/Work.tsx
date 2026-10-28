import type { CSSProperties } from "react";
import { SHOW_SAMPLE_TAGS, WORK } from "@/lib/data";
import { ART } from "@/lib/art";
import Split from "./Split";

export default function Work() {
  return (
    <section className="work" id="work" aria-label="Our work">
      <div className="in">
        <div className="work-head">
          <p className="eyebrow">Selected work</p>
          <Split parts={["Work that made some ", { em: "noise." }]} />
          <p className="lead rv">A look at the campaigns, identities and builds we have shipped for brands.</p>
        </div>
        <div className="wk-list">
          {WORK.map((w, i) => (
            <article key={i} className="wk" style={{ "--i": i, "--bg": w.bg, "--fg": w.fg, "--panel": w.panel } as CSSProperties}>
              <div className="tx">
                <div className="meta"><span>{w.client}</span>{SHOW_SAMPLE_TAGS && <span className="tag">Sample</span>}</div>
                <h3>{w.title}</h3>
                <p>{w.d}</p>
                <ul className="chips">{w.c.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="art">{ART[w.art]}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
