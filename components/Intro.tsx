import type { CSSProperties } from "react";

const FW = [
  { sp: 90, s: { left: "8%", top: "16%", width: 34 } },
  { sp: 180, s: { left: "84%", top: "22%", width: 58, opacity: 0.85 } },
  { sp: 60, s: { left: "18%", top: "74%", width: 46, opacity: 0.7 } },
  { sp: 130, s: { left: "90%", top: "70%", width: 28 } },
  { sp: 220, s: { left: "50%", top: "8%", width: 22, opacity: 0.6 } },
  { sp: 110, s: { left: "70%", top: "88%", width: 38, opacity: 0.5 } },
];
const FLOOD_FW = [
  { sp: 80, s: { left: "6%", top: "70%", width: 90 } },
  { sp: 150, s: { left: "82%", top: "14%", width: 150 } },
];
const MANIFESTO = "Brands that blend in get scrolled past. We build the ones that don't.";

function Flower({ sp, s }: { sp: number; s: CSSProperties }) {
  return (
    <div className="fw" data-sp={sp} style={s}>
      <svg><use href="#wedge" /></svg>
    </div>
  );
}

export default function Intro() {
  const words = MANIFESTO.split(" ");
  return (
    <section className="intro" id="intro" aria-label="Wacko Studios">
      <h1 className="sr-only">Wacko Studios, a creative marketing agency</h1>
      <div className="stage" id="stage">
        <div className="stage-bg" />
        {FW.map((f, i) => <Flower key={i} {...f} />)}

        <div className="logo-area" id="logoArea">
          <div className="logo-wrap" id="logoWrap">
            {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className={`slice s${n}`} />)}
            <i className="notch" id="notch" />
          </div>
          <p className="tagline" id="tagline">Creative marketing for brands that refuse to <b>blend in.</b></p>
          <div className="cue" id="cue">Scroll<i /></div>
        </div>

        <div className="flood" id="flood">
          {FLOOD_FW.map((f, i) => <Flower key={i} {...f} />)}
          <div className="in manifesto">
            <p className="eyebrow">Who we are</p>
            <p className="big" id="manifesto">
              {words.map((w, i) => (<span key={i}><span className="mw">{w}</span>{i < words.length - 1 ? " " : ""}</span>))}
            </p>
            <p className="sub">Wacko Studios is a marketing agency that puts content, campaigns, branding and code under one roof, so your idea ships fast and looks like nobody else&apos;s.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
