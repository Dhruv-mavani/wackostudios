import { SERVICES } from "@/lib/data";
import { ICONS } from "@/lib/art";
import Split from "./Split";
import { GoLink } from "./Chrome";

export default function Services() {
  return (
    <section className="services" id="services" aria-label="Services">
      <div className="sv-stick" id="svStick">
        <div className="ghost" id="ghost" aria-hidden="true">Services</div>
        <div className="sv-row" id="svRow">
          <div className="sv-intro">
            <p className="eyebrow">What we do</p>
            <Split parts={["Everything a loud brand needs."]} />
            <p className="lead">From the first idea to the last click, one team plans it, shoots it, designs it, builds it and runs it.</p>
            <span className="hint">
              Keep scrolling{" "}
              <svg viewBox="0 0 46 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 7h42M37 1l6 6-6 6" /></svg>
            </span>
          </div>
          {SERVICES.map((s, i) => (
            <article className="card" key={s.n} data-name={s.n}>
              <div className="no"><span>{String(i + 1).padStart(2, "0")}</span><span>/ {SERVICES.length}</span></div>
              <svg className="ico" viewBox="0 0 64 64" aria-hidden="true">{ICONS[s.i]}</svg>
              <h3>{s.n}</h3>
              <p>{s.d}</p>
              <ul className="chips">{s.c.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          ))}
          <div className="sv-outro">
            <h3>…and whatever else your brand <em>needs.</em></h3>
            <GoLink className="btn navy" to="#book">Book a 30 minute call</GoLink>
          </div>
        </div>
        <div className="sv-hud"><span id="svCount">00 / 10</span><div className="bar"><i id="svBar" /></div><span className="nm" id="svName">Services</span></div>
      </div>
    </section>
  );
}
