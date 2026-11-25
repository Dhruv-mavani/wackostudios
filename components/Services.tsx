import { SERVICES } from "@/lib/data";
import Split from "./Split";
import { GoLink } from "./Chrome";
import ServiceGlass from "./ServiceGlass";

/**
 * Services: a pinned section. Scrolling steps through the services one by one; a bending glass card (ServiceGlass)
 * turns to show the active one, and the list on the left follows. Every service's text is in the HTML below, so the
 * section reads fine without JavaScript or WebGL (then it lays the services out as plain cards, `.sv-flat`).
 */
export default function Services() {
  return (
    <section className="services" id="services" aria-label="Services" style={{ "--n": SERVICES.length } as React.CSSProperties}>
      <div className="sv-stick">
        <div className="sv-word" aria-hidden="true">Services</div>
        <div className="sv-grid">
          <div className="sv-copy">
            <p className="eyebrow">What we do</p>
            <Split parts={["Everything a loud brand needs."]} />
            <p className="lead">From the first idea to the last click, one team plans it, shoots it, designs it, automates it, builds it and runs it.</p>
            <ol className="sv-list">
              {SERVICES.map((s, i) => (
                <li className={`sv-item${i === 0 ? " on" : ""}`} key={s.n} data-i={i}>
                  <span className="sv-no">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="sv-nm">{s.n}</h3>
                  <div className="sv-more">
                    <p>{s.d}</p>
                    <ul className="chips">{s.c.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                </li>
              ))}
            </ol>
            <GoLink className="btn sv-cta" to="#book">Book a 30 minute call</GoLink>
          </div>
          <div className="sv-glass">
            <ServiceGlass />
          </div>
        </div>
        <div className="sv-hud" aria-hidden="true"><span id="svCount">{`01 / ${SERVICES.length}`}</span><div className="bar"><i id="svBar" /></div><span className="nm" id="svName">{SERVICES[0].n}</span></div>
      </div>
    </section>
  );
}
