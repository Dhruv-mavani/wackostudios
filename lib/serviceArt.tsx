import type { CSSProperties, ReactNode } from "react";

/**
 * One small illustrated scene per service (viewBox 0 0 120 120), ported from the Wacko Studios icon showcase.
 *
 * Colours come from CSS variables set on the card, so a scene recolours itself when the card turns orange:
 *   ia = main ink, ib = accent, ic = soft tint, bg = the card's own background.
 * Layers in .pl1/.pl2 shift with the cursor; the .a-* classes are animated in globals.css while the card is
 * hovered or centred in the reel.
 */
type V = "bg" | "ia" | "ib" | "ic";
const v = (c: V) => `var(--${c})`;
const f = (c: V, x: object = {}) => ({ fill: v(c), ...x }) as CSSProperties;
const s = (c: V, w: number, x: object = {}) => ({ fill: "none", stroke: v(c), strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round", ...x }) as CSSProperties;
const fs = (fc: V, sc: V, w: number, x: object = {}) => ({ fill: v(fc), stroke: v(sc), strokeWidth: w, strokeLinejoin: "round", ...x }) as CSSProperties;

const WEDGE = "M0 58 L128 0 Q88 58 83 120 Q60 80 0 58Z";

export const SERVICE_ART: Record<string, ReactNode> = {
  // Phone being filmed: focus brackets snap in, the progress bar fills, REC blinks.
  content: (
    <>
      <g className="pl1"><circle cx="60" cy="60" r="38" style={f("ic")} /></g>
      <g className="pl2">
        <rect x="41" y="22" width="38" height="76" rx="9" style={f("ia")} />
        <rect x="45" y="30" width="30" height="56" rx="4" style={f("bg")} />
        <rect x="55" y="25" width="10" height="2.5" rx="1.25" style={f("bg")} />
        <path d="M55 47 L67 55 L55 63 Z" style={fs("ib", "ib", 4)} />
        <rect x="49" y="76" width="22" height="4" rx="2" style={f("ic")} />
        <rect className="a-prog" x="49" y="76" width="22" height="4" rx="2" style={f("ib", { transform: "scaleX(.6)" })} />
        <circle cx="60" cy="92" r="2.5" style={f("bg")} />
      </g>
      <g className="pl1">
        {[
          ["M16 34 V16 H34", 5, 5],
          ["M86 16 H104 V34", -5, 5],
          ["M16 86 V104 H34", 5, -5],
          ["M86 104 H104 V86", -5, -5],
        ].map(([p, dx, dy]) => (
          <path key={p as string} className="a-snap" d={p as string} style={s("ia", 6, { "--dx": `${dx}px`, "--dy": `${dy}px` })} />
        ))}
        <circle className="a-blink" cx="92" cy="28" r="5" style={f("ib")} />
      </g>
    </>
  ),
  // Creator profile with a verified tick; a like bubble pops and hearts float up.
  influencer: (
    <>
      <g className="pl1"><circle cx="44" cy="72" r="34" style={f("ic")} /></g>
      <g className="pl2">
        <circle cx="44" cy="62" r="15" style={f("ia")} />
        <path d="M16 104 Q16 82 44 82 Q72 82 72 104 Z" style={f("ia")} />
        <circle cx="60" cy="50" r="9" style={fs("ib", "bg", 3)} />
        <path d="M55.5 50 L58.8 53.3 L64.5 47" style={s("bg", 3)} />
      </g>
      <g className="pl1">
        <g className="a-pop">
          <rect x="64" y="12" width="46" height="36" rx="11" style={f("ia")} />
          <path d="M72 44 L68 58 L84 46 Z" style={fs("ia", "ia", 2)} />
          <path d="M87 38 C75 30 79 20 87 26 C95 20 99 30 87 38 Z" style={f("ib")} />
        </g>
        <g transform="translate(98 74)"><path className="a-float" d="M0 6 C-9 0 -6 -7.5 0 -3 C6 -7.5 9 0 0 6 Z" style={f("ib", { "--d": ".1s" })} /></g>
        <g transform="translate(86 92)"><path className="a-float" d="M0 4.5 C-7 0 -4.5 -5.6 0 -2.2 C4.5 -5.6 7 0 0 4.5 Z" style={f("ia", { "--d": ".7s" })} /></g>
        <g transform="translate(106 98)"><path className="a-float" d="M0 4.5 C-7 0 -4.5 -5.6 0 -2.2 C4.5 -5.6 7 0 0 4.5 Z" style={f("ib", { "--d": "1.2s" })} /></g>
      </g>
    </>
  ),
  // Bullseye: the arrow lands, the target thuds and ripples, a trend pill sits on the corner.
  perf: (
    <>
      <g className="pl1"><circle cx="56" cy="64" r="46" style={f("ic")} /></g>
      <g className="pl2">
        <g className="a-thud" style={{ transformOrigin: "56px 64px" }}>
          <circle cx="56" cy="64" r="38" style={f("ia")} />
          <circle cx="56" cy="64" r="28" style={f("bg")} />
          <circle cx="56" cy="64" r="18" style={f("ia")} />
          <circle cx="56" cy="64" r="9" style={f("ib")} />
        </g>
        <circle className="a-ripple" cx="56" cy="64" r="9" style={{ fill: "none", stroke: v("ib"), strokeWidth: 3, opacity: 0 }} />
        <g className="a-shoot">
          <path d="M56 64 L98 22" style={s("bg", 11)} />
          <path d="M56 64 L98 22" style={s("ib", 5)} />
          <path d="M88 32 L100 20 L94.3 14.3 Z" style={fs("ia", "bg", 2)} />
          <path d="M88 32 L100 20 L105.7 25.7 Z" style={fs("ia", "bg", 2)} />
        </g>
      </g>
      <g className="pl1">
        <rect x="70" y="90" width="42" height="22" rx="11" style={fs("ib", "bg", 3)} />
        <path d="M79 106 L86 99 L91 103 L101 95" style={s("bg", 3)} />
        <path d="M95.5 95 H101 V100.5" style={s("bg", 3)} />
      </g>
    </>
  ),
  // Browser window: code lines type out, the caret blinks, a </> badge floats.
  dev: (
    <>
      <g className="pl1"><rect x="18" y="26" width="96" height="76" rx="10" style={f("ic")} /></g>
      <g className="pl2">
        <rect x="10" y="18" width="96" height="76" rx="10" style={f("ia")} />
        <circle cx="21" cy="28" r="3.5" style={f("ib")} />
        <circle cx="31" cy="28" r="3.5" style={f("bg")} />
        <circle cx="41" cy="28" r="3.5" style={f("bg")} />
        <rect x="16" y="37" width="84" height="51" rx="6" style={f("bg")} />
        {([[23, 45, 26, "ib", 0], [53, 45, 30, "ia", 0.15], [31, 55, 40, "ia", 0.35], [31, 65, 22, "ic", 0.55], [57, 65, 16, "ib", 0.7], [23, 75, 28, "ia", 0.9]] as [number, number, number, V, number][]).map(([x, y, w, c, dl]) => (
          <rect key={`${x}-${y}`} className="a-type" x={x} y={y} width={w} height="5" rx="2.5" style={f(c, { "--d": `${dl}s` })} />
        ))}
        <rect className="a-caret" x="55" y="73" width="4" height="9" rx="1" style={f("ib")} />
      </g>
      <g className="pl1">
        <rect x="70" y="78" width="42" height="30" rx="10" style={fs("ib", "bg", 3)} />
        <path d="M83 87 L77 93 L83 99" style={s("bg", 3.5)} />
        <path d="M93.5 86 L89 100" style={s("bg", 3.5)} />
        <path d="M100 87 L106 93 L100 99" style={s("bg", 3.5)} />
      </g>
    </>
  ),
  // Calendar: a ticked slot hops across the days.
  plan: (
    <>
      <g className="pl1"><rect x="22" y="28" width="88" height="80" rx="14" style={f("ic")} /></g>
      <g className="pl2">
        <rect x="14" y="22" width="88" height="80" rx="14" style={f("ia")} />
        <path d="M14 36 A14 14 0 0 1 28 22 H88 A14 14 0 0 1 102 36 V44 H14 Z" style={f("ib")} />
        <rect x="32" y="13" width="8" height="18" rx="4" style={fs("ia", "bg", 3)} />
        <rect x="76" y="13" width="8" height="18" rx="4" style={fs("ia", "bg", 3)} />
        {[52, 68, 84].flatMap((y) => [24, 43, 62, 81].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="14" height="12" rx="3" style={f("bg", { opacity: 0.2 })} />))}
      </g>
      <g className="pl2">
        <g className="a-hop">
          <rect x="42" y="67" width="16" height="14" rx="3.5" style={fs("ib", "bg", 2)} />
          <path d="M46 74 L49.2 77.2 L54.5 71" style={s("ia", 2.8)} />
        </g>
      </g>
    </>
  ),
  // Megaphone: shakes while sound waves ring out and a spark twirls in.
  ads: (
    <>
      <g className="pl1"><circle cx="52" cy="62" r="40" style={f("ic")} /></g>
      <g className="pl2">
        <g className="a-shake" style={{ transformOrigin: "40px 70px" }}>
          <rect x="18" y="50" width="16" height="22" rx="5" style={f("ib")} />
          <path d="M42 74 L48 96 H58 L54 78 Z" style={fs("ib", "ib", 3)} />
          <path d="M30 50 L72 28 V94 L30 72 Z" style={fs("ia", "ia", 4)} />
          <rect x="68" y="24" width="11" height="74" rx="5.5" style={f("ia")} />
        </g>
      </g>
      <g className="pl1">
        <path className="a-wave" d="M88 48 Q94 61 88 74" style={s("ib", 6, { "--d": "0s" })} />
        <path className="a-wave" d="M97 39 Q107 61 97 83" style={s("ib", 6, { "--d": ".15s" })} />
        <path className="a-wave" d="M106 30 Q120 61 106 92" style={s("ib", 6, { "--d": ".3s" })} />
        <g transform="translate(22 26)"><path className="a-twirl" d="M0 -11 L3 -3 L11 0 L3 3 L0 11 L-3 3 L-11 0 L-3 -3 Z" style={fs("ib", "ib", 2)} /></g>
      </g>
    </>
  ),
  // The Wacko wedge in a selection box: handles pop, dashes march, colour swatches fan out.
  brand: (
    <>
      <g className="pl1"><rect x="14" y="14" width="66" height="62" style={f("ic")} /></g>
      <g className="pl2">
        <g transform="translate(20 21) scale(.42)"><path d={WEDGE} style={f("ib")} /></g>
        <rect className="a-march" x="14" y="14" width="66" height="62" style={{ fill: "none", stroke: v("ia"), strokeWidth: 3.5, strokeDasharray: "7 6" }} />
        {[[8.5, 8.5, 0], [74.5, 8.5, 0.1], [74.5, 70.5, 0.2], [8.5, 70.5, 0.3]].map(([x, y, dl]) => (
          <rect key={`${x}-${y}`} className="a-handle" x={x} y={y} width="11" height="11" rx="2" style={fs("ia", "bg", 2.5, { "--d": `${dl}s` })} />
        ))}
      </g>
      <g className="pl1">
        <rect className="a-fan" x="92" y="76" width="12" height="34" rx="5" style={fs("bg", "ia", 2.5, { "--r": "-10deg", transformOrigin: "98px 110px", transform: "rotate(-10deg)" })} />
        <rect className="a-fan" x="92" y="76" width="12" height="34" rx="5" style={fs("ia", "bg", 2, { "--r": "8deg", transformOrigin: "98px 110px", transform: "rotate(8deg)" })} />
        <rect className="a-fan" x="92" y="76" width="12" height="34" rx="5" style={fs("ib", "bg", 2, { "--r": "26deg", transformOrigin: "98px 110px", transform: "rotate(26deg)" })} />
        <circle cx="98" cy="104" r="2.5" style={f("bg")} />
      </g>
    </>
  ),
  // Pen-tool curve: the path draws itself and the anchors pop in.
  graphic: (
    <>
      <g className="pl1"><circle cx="60" cy="60" r="40" style={f("ic")} /></g>
      <g className="pl1">
        <path d="M20 88 L42 22" style={s("ia", 4)} />
        <path d="M100 32 L78 98" style={s("ia", 4)} />
        <circle className="a-knob" cx="42" cy="22" r="6" style={f("ia", { "--d": ".9s" })} />
        <circle className="a-knob" cx="78" cy="98" r="6" style={f("ia", { "--d": "1s" })} />
      </g>
      <g className="pl2">
        <path className="a-draw" pathLength={1} d="M20 88 C42 22 78 98 100 32" style={s("ib", 8)} />
        {([[13, 81, "ia", 0], [53, 53, "ib", 0.35], [93, 25, "ia", 0.7]] as [number, number, V, number][]).map(([x, y, c, dl]) => (
          <rect key={x} className="a-knob" x={x} y={y} width="14" height="14" rx="3" style={fs(c, "bg", 3, { "--d": `${dl}s` })} />
        ))}
      </g>
    </>
  ),
  // Preview monitor over a timeline: the playhead scrubs along the clips.
  video: (
    <>
      <g className="pl1"><rect x="20" y="18" width="86" height="56" rx="9" style={f("ic")} /></g>
      <g className="pl2">
        <rect x="14" y="12" width="86" height="56" rx="9" style={f("ia")} />
        <rect x="20" y="18" width="74" height="42" rx="5" style={f("bg")} />
        <path d="M51 30 L65 39 L51 48 Z" style={fs("ib", "ib", 3)} />
        <rect x="51" y="68" width="12" height="6" style={f("ia")} />
        <rect x="42" y="73" width="30" height="4" rx="2" style={f("ia")} />
      </g>
      <g className="pl1">
        <rect x="10" y="82" width="100" height="28" rx="7" style={f("ic")} />
        {([[14, 86, 30, 9, "ia"], [47, 86, 22, 9, "ib"], [72, 86, 34, 9, "ia"], [14, 98, 22, 8, "ib"], [39, 98, 40, 8, "ia"], [82, 98, 24, 8, "ib"]] as [number, number, number, number, V][]).map(([x, y, w, h, c]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="3" style={f(c)} />
        ))}
        <g className="a-scrub">
          <rect x="58" y="78" width="4" height="34" rx="2" style={fs("ib", "bg", 2)} />
          <path d="M53 75 H67 L60 83 Z" style={fs("ib", "bg", 2)} />
        </g>
      </g>
    </>
  ),
  // Funnel: prospects drop in and a ticked lead pops out.
  lead: (
    <>
      <g className="pl1"><circle cx="60" cy="58" r="40" style={f("ic")} /></g>
      <g className="pl1">
        {([[40, 14, "ib", 0], [60, 8, "ia", 0.55], [80, 14, "ib", 1.1]] as [number, number, V, number][]).map(([x, y, c, dl]) => (
          <circle key={x} className="a-drop" cx={x} cy={y} r="5" style={f(c, { "--d": `${dl}s` })} />
        ))}
      </g>
      <g className="pl2">
        <path d="M18 36 H102 L70 68 V90 L50 100 V68 Z" style={fs("ia", "ia", 4)} />
        <rect x="12" y="26" width="96" height="12" rx="6" style={f("ia")} />
        <path d="M36 52 H84 L78 58 H42 Z" style={f("bg", { opacity: 0.2 })} />
        <g className="a-badge">
          <circle cx="86" cy="98" r="14" style={fs("ib", "bg", 3)} />
          <path d="M79.5 98 L84 102.5 L92.5 93.5" style={s("bg", 4)} />
        </g>
      </g>
    </>
  ),
};
