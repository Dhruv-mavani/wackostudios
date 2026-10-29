import type { CSSProperties } from "react";
import { LOGO_H, LOGO_W, WEDGE, sectorPath } from "@/lib/wedge";
import { LOGO_PIECES } from "@/lib/logoPath";

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

function Flower({ sp, s, i }: { sp: number; s: CSSProperties; i: number }) {
  return (
    <div className="fw" data-sp={sp} style={{ ...s, animationDelay: `${0.5 + i * 0.14}s` }}>
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
        <div className="stage-bg"><canvas className="dot-grid" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} /></div>
        <div className="stage-glow" aria-hidden="true" />
        {FW.map((f, i) => <Flower key={i} i={i} {...f} />)}

        <div className="logo-area" id="logoArea">
          <div className="logo-pulse">
          <div className="logo-wrap" id="logoWrap">
            {/* One piece per letter, so the logo splits along its letters (see ScrollEngine) rather than through them. */}
            {LOGO_PIECES.map((pc) => (
              <svg
                key={pc.id}
                className="slice"
                data-row={pc.row}
                data-i={pc.i}
                data-cx={pc.cx}
                viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
                preserveAspectRatio="none"
                aria-hidden="true"
                style={{ transformOrigin: `${(pc.cx / LOGO_W) * 100}% ${(pc.cy / LOGO_H) * 100}%` }}
              >
                <path d={pc.d} fill="#fff" fillRule="evenodd" />
              </svg>
            ))}
            {/* The wedge is its own element so it can zoom in and open up into a circle on scroll. */}
            <div className="wedge-fly">
              <svg className="wedge" id="logoWedge" viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} aria-hidden="true">
                <path id="wedgePath" fill="#E66A2C" d={sectorPath(WEDGE.half)} />
              </svg>
            </div>
            <i className="apex" id="apex" />
          </div>
          </div>
          <p className="tagline" id="tagline">Creative marketing for brands that refuse to <b>blend in.</b></p>
          <div className="cue" id="cue">Scroll<i /></div>
        </div>

        <div className="flood" id="flood">
          {FLOOD_FW.map((f, i) => <Flower key={i} i={0} {...f} />)}
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
