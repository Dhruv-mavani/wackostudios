import type { CSSProperties } from "react";
import { LOGO_H, LOGO_W, STAR } from "@/lib/wedge";
import { LOGO_PIECES, STAR_PATH } from "@/lib/logoPath";

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
// The W mark is built from stacked copies of its own shape, each pushed a little further back in 3D, so it has real thickness
// when the logo tilts. The shape is shared with every layer as one CSS mask (a data URI) instead of repeating the path.
const DEPTH = 14;
const MARK = LOGO_PIECES.find((p) => p.row === "mark")!;
const MARK_MASK = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${MARK.w} ${MARK.h}'><path d='${MARK.d}' fill-rule='evenodd'/></svg>`)}")`;
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
        <div className="stage-bg">
          {/* Gradient background: soft colour blobs that drift slowly (pointer-events none). The glass logo and arrows refract them. */}
          <i className="gl-blob b1" /><i className="gl-blob b2" /><i className="gl-blob b3" />
          <canvas className="dot-grid" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} /></div>
        <div className="stage-glow" aria-hidden="true" />
        {FW.map((f, i) => <Flower key={i} i={i} {...f} />)}

        <div className="logo-area" id="logoArea">
          <div className="logo-tilt">
          <div className="logo-pulse">
          <div className="logo-wrap" id="logoWrap">
            {/* The orange W mark and one piece per letter, so the logo splits along its letters (see ScrollEngine) rather than through them. */}
            {LOGO_PIECES.map((pc) => (
              <div
                key={pc.id}
                className="slice"
                data-row={pc.row}
                data-i={pc.i}
                data-cx={pc.cx}
                aria-hidden="true"
                style={{
                  left: `${(pc.x / LOGO_W) * 100}%`,
                  top: `${(pc.y / LOGO_H) * 100}%`,
                  width: `${(pc.w / LOGO_W) * 100}%`,
                  height: `${(pc.h / LOGO_H) * 100}%`,
                  transformOrigin: `${((pc.cx - pc.x) / pc.w) * 100}% ${((pc.cy - pc.y) / pc.h) * 100}%`,
                }}
              >
                {pc.row === "mark" ? (
                  <div className="mark3d" style={{ "--mask": MARK_MASK } as CSSProperties}>
                    {Array.from({ length: DEPTH }, (_, k) => <i key={k} className="ext" style={{ "--i": DEPTH - 1 - k } as CSSProperties} />)}
                  </div>
                ) : (
                  <div className="rise" style={{ "--k": pc.i } as CSSProperties}>
                    <svg className="slice-fill" viewBox={`0 0 ${pc.w} ${pc.h}`} preserveAspectRatio="none" aria-hidden="true">
                      <path d={pc.d} fill="#113462" fillRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {/* The asterisk is its own element so it can zoom in and swell into an orange disc on scroll. */}
            <div className="wedge-fly">
              <i className="apex" id="apex" />
              <svg className="wedge" id="logoWedge" viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} aria-hidden="true">
                <path id="starPath" fill="#113462" fillRule="evenodd" d={STAR_PATH} />
                <circle id="wedgePath" cx={STAR.x} cy={STAR.y} r="0" fill="#E77249" />
              </svg>
            </div>
          </div>
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
