/*
 * components/DiwaliIcons.tsx · Wacko Studios Diwali set (React / Next.js)
 * GENERATED from diya.svg, sutli-bomb.svg and phuljhari.svg by build_diwali.py.
 * Edit the .svg files (or re-run make_phuljhari.py), then re-run:
 *     python3 build_diwali.py
 * to refresh this file and diwali-playground.html. Don't hand-edit this file.
 *
 *   import { Diya, SutliBomb, Phuljhari } from "./DiwaliIcons";
 *   <Diya size={96} />            <SutliBomb lit={false} />            <Phuljhari size={200} />
 *
 * Note: sutli-bomb and phuljhari use SVG ids (sutli-clip, pj-glow-grad, pj-blur).
 * Several copies on one page share them, which is fine as long as colours are the same.
 */

type IconProps = { lit?: boolean; size?: number; title?: string; className?: string; style?: React.CSSProperties };

/* ---------- Diya (from diya.svg) ---------- */
const DIYA_CSS = `
/* ============================================================
   DIYA · Wacko Studios Diwali set
   Light / unlight:  data-lit = true | false
   Recolour:         --diya-clay, --diya-oil, --diya-dots, --flame-outer, --flame-inner, --flame-glow
   ============================================================ */
.diya{--diya-clay:#E66A2C;--diya-oil:#172033;--diya-dots:#FFFFFF;--diya-ink:#172033;
  --flame-outer:#FFB627;--flame-inner:#FFF4C7;--flame-glow:#FFB627;overflow:visible}
.diya .clay{fill:var(--diya-clay);stroke:var(--diya-ink);stroke-width:3;stroke-linejoin:round}
.diya .oil{fill:var(--diya-oil)}
.diya .dots{fill:var(--diya-dots)}
.diya .wick{fill:none;stroke:var(--diya-ink);stroke-width:3;stroke-linecap:round}
.diya .shade{fill:var(--diya-ink);opacity:.14}
.diya .flame-outer{fill:var(--flame-outer)}
.diya .flame-inner{fill:var(--flame-inner)}
.diya .glow{fill:var(--flame-glow);opacity:.22}

/* the flame group is hidden when unlit */
.diya[data-lit="false"] .d-fire{display:none}

/* pivots: flame sways from its base on the wick */
.diya .d-flame{transform-box:view-box;transform-origin:97px 50px;animation:diya-flicker 1.4s ease-in-out infinite}
.diya .d-flame-core{transform-box:view-box;transform-origin:97px 50px;animation:diya-core .9s ease-in-out infinite alternate}
.diya .d-glow{transform-box:fill-box;transform-origin:50% 50%;animation:diya-glow 2.2s ease-in-out infinite}

@keyframes diya-flicker{0%,100%{transform:rotate(0) scale(1,1)}25%{transform:rotate(-4deg) scale(.96,1.05)}50%{transform:rotate(2deg) scale(1.03,.95)}75%{transform:rotate(-2deg) scale(.98,1.03)}}
@keyframes diya-core{from{transform:scale(1,1)}to{transform:scale(.9,1.08)}}
@keyframes diya-glow{0%,100%{transform:scale(1);opacity:.2}50%{transform:scale(1.12);opacity:.3}}
@media (prefers-reduced-motion:reduce){.diya *{animation:none !important}}
`;

export function Diya({ lit = true, size = 120, title = "Diwali diya", className = "", style }: IconProps) {
  return (
    <svg
      className={`diya ${className}`}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      data-lit={String(lit)}
      role="img"
      aria-label={title}
      style={style}
    >
      <style>{DIYA_CSS}</style>
      {/* ground shadow */}
      <ellipse className="shade" cx="58" cy="106" rx="34" ry="4" />

      {/* FIRE: glow + flame (hidden when data-lit="false") */}
      <g className="d-fire">
        <circle className="glow d-glow" cx="97" cy="34" r="24" />
        <g className="d-flame">
          <path className="flame-outer" d="M97 50 C85 44 87 28 97 12 C107 28 109 44 97 50 Z" />
          <path className="flame-inner d-flame-core" d="M97 48 C91 44 92 35 97 26 C102 35 103 44 97 48 Z" />
        </g>
      </g>

      {/* WICK */}
      <path className="wick" d="M92 60 Q97 56 97 50" />

      {/* BOWL: clay body with a pointed spout on the right */}
      <g className="d-bowl">
        <path className="clay" d="M12 70 C12 64 30 62 60 62 C78 62 92 60 106 52 C103 64 99 70 96 74 C92 92 78 102 58 102 C34 102 16 90 12 70 Z" />
        <path className="oil" d="M19 69 C25 66 40 65.5 60 65.5 C77 65.5 89 63.5 99 58 C95 64 90 68 84 70 C70 74 32 74 19 69 Z" />
        {/* painted dots */}
        <circle className="dots" cx="27" cy="82" r="3" />
        <circle className="dots" cx="40" cy="87" r="3" />
        <circle className="dots" cx="55" cy="89" r="3" />
        <circle className="dots" cx="70" cy="88" r="3" />
        <circle className="dots" cx="84" cy="83" r="3" />
        <circle className="dots" cx="48" cy="95" r="2" />
        <circle className="dots" cx="63" cy="96" r="2" />
      </g>
    </svg>
  );
}

/* ---------- SutliBomb (from sutli-bomb.svg) ---------- */
const SUTLIBOMB_CSS = `
/* ============================================================
   SUTLI BOMB · Wacko Studios Diwali set
   Light / unlight fuse:  data-lit = true | false
   Recolour:              --bomb-green, --bomb-twine, --bomb-shine, --fuse, --spark, --bomb-ink
   ============================================================ */
.sutli{--bomb-green:#2E9E5B;--bomb-twine:#1B6B3B;--bomb-shine:#FFFFFF;--bomb-ink:#172033;
  --fuse:#C9A66B;--spark:#FFD166;--spark-hot:#FFFFFF;overflow:visible}
.sutli .body{fill:var(--bomb-green)}
.sutli .edge{fill:none;stroke:var(--bomb-ink);stroke-width:3}
.sutli .twine{fill:none;stroke:var(--bomb-twine);stroke-width:2.4;stroke-linecap:round}
.sutli .shine{fill:var(--bomb-shine);opacity:.28}
.sutli .label{fill:var(--bomb-shine);stroke:var(--bomb-ink);stroke-width:2.5;stroke-linejoin:round}
.sutli .s-wedge{fill:#E66A2C}
.sutli .fuse{fill:none;stroke:var(--fuse);stroke-width:4;stroke-linecap:round;stroke-dasharray:1 2}
.sutli .fuse-cap{fill:var(--bomb-ink)}
.sutli .shade{fill:var(--bomb-ink);opacity:.14}
.sutli .spark{fill:var(--spark)}
.sutli .spark-hot{fill:var(--spark-hot)}
.sutli .spark-line{fill:none;stroke:var(--spark);stroke-width:2.2;stroke-linecap:round}

.sutli[data-lit="false"] .s-spark{display:none}

/* pivots */
.sutli .s-bomb{transform-box:view-box;transform-origin:60px 104px}
.sutli .s-spark{transform-box:view-box;transform-origin:86px 10px}
.sutli .s-star{transform-box:fill-box;transform-origin:50% 50%;animation:sutli-star .35s ease-in-out infinite alternate}
.sutli .s-ray{transform-box:view-box;transform-origin:86px 10px;animation:sutli-ray .5s ease-out infinite}
.sutli .s-ray.r2{animation-delay:.12s}.sutli .s-ray.r3{animation-delay:.24s}.sutli .s-ray.r4{animation-delay:.36s}
.sutli[data-lit="true"] .s-bomb{animation:sutli-jitter 2.4s ease-in-out infinite}

@keyframes sutli-star{from{transform:scale(.8) rotate(0)}to{transform:scale(1.2) rotate(25deg)}}
@keyframes sutli-ray{0%{transform:scale(.3);opacity:1}100%{transform:scale(1.4);opacity:0}}
@keyframes sutli-jitter{0%,88%,100%{transform:rotate(0)}91%{transform:rotate(-2deg)}94%{transform:rotate(2deg)}97%{transform:rotate(-1deg)}}
@media (prefers-reduced-motion:reduce){.sutli *{animation:none !important}}
`;

export function SutliBomb({ lit = true, size = 120, title = "Green sutli bomb", className = "", style }: IconProps) {
  return (
    <svg
      className={`sutli ${className}`}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      data-lit={String(lit)}
      role="img"
      aria-label={title}
      style={style}
    >
      <style>{SUTLIBOMB_CSS}</style>
      <defs>
        <clipPath id="sutli-clip"><circle cx="60" cy="68" r="36" /></clipPath>
      </defs>

      <ellipse className="shade" cx="60" cy="108" rx="30" ry="4" />

      <g className="s-bomb">
        {/* BALL */}
        <circle className="body" cx="60" cy="68" r="36" />

        {/* TWINE: two layers of wraps, clipped to the ball */}
        <g clipPath="url(#sutli-clip)">
          <g className="s-twine-a">
            <path className="twine" d="M20 40 Q60 50 100 40" />
            <path className="twine" d="M20 48 Q60 58 100 48" />
            <path className="twine" d="M20 56 Q60 66 100 56" />
            <path className="twine" d="M20 64 Q60 74 100 64" />
            <path className="twine" d="M20 72 Q60 82 100 72" />
            <path className="twine" d="M20 80 Q60 90 100 80" />
            <path className="twine" d="M20 88 Q60 98 100 88" />
            <path className="twine" d="M20 96 Q60 106 100 96" />
          </g>
          <g className="s-twine-b" transform="rotate(62 60 68)">
            <path className="twine" d="M20 44 Q60 54 100 44" />
            <path className="twine" d="M20 56 Q60 66 100 56" />
            <path className="twine" d="M20 68 Q60 78 100 68" />
            <path className="twine" d="M20 80 Q60 90 100 80" />
            <path className="twine" d="M20 92 Q60 102 100 92" />
          </g>
          <g className="s-twine-c" transform="rotate(-58 60 68)">
            <path className="twine" d="M20 50 Q60 60 100 50" />
            <path className="twine" d="M20 66 Q60 76 100 66" />
            <path className="twine" d="M20 82 Q60 92 100 82" />
          </g>
        </g>

        {/* shine + outline */}
        <ellipse className="shine" cx="46" cy="52" rx="11" ry="7" transform="rotate(-30 46 52)" />
        <circle className="edge" cx="60" cy="68" r="36" />

        {/* FUSE */}
        <rect className="fuse-cap" x="54" y="28" width="12" height="8" rx="3" />
        <path className="fuse" pathLength="1" d="M60 30 Q60 18 72 15 Q82 13 86 10" />
      </g>

      {/* SPARK at the fuse tip (hidden when data-lit="false") */}
      <g className="s-spark">
        <path className="spark-line s-ray r1" d="M86 10 L98 2" />
        <path className="spark-line s-ray r2" d="M86 10 L100 14" />
        <path className="spark-line s-ray r3" d="M86 10 L90 -4" />
        <path className="spark-line s-ray r4" d="M86 10 L76 0" />
        <path className="spark s-star" d="M86 1 L88.5 7.5 L95 10 L88.5 12.5 L86 19 L83.5 12.5 L77 10 L83.5 7.5 Z" />
        <circle className="spark-hot" cx="86" cy="10" r="2.6" />
      </g>
    </svg>
  );
}

/* ---------- Phuljhari (from phuljhari.svg) ---------- */
const PHULJHARI_CSS = `
/* ============================================================
   PHULJHARI · Wacko Studios Diwali set
   GENERATED by make_phuljhari.py (seed 2026, 36 sparks).
   Re-run the script to change sparks; edit colours here or with its flags.
   Light / unlight:  data-lit = true | false
   Recolour:         --pj-spark, --pj-glow, --pj-hot, --pj-rod, --pj-wire
   ============================================================ */
.phuljhari{--pj-spark:#FFF6D5;--pj-glow:#FFB627;--pj-hot:#FF7A1A;--pj-rod:#4A4F57;--pj-wire:#A3A9B1;overflow:visible}
.phuljhari .pj-wire{fill:none;stroke:var(--pj-wire);stroke-width:2.2;stroke-linecap:round}
.phuljhari .pj-rod{fill:none;stroke:var(--pj-rod);stroke-width:6.5;stroke-linecap:round}
.phuljhari .pj-burnt{fill:none;stroke:#26282C;stroke-width:5;stroke-linecap:round}
.phuljhari .pj-fleck{fill:#7C828B}
.phuljhari .pj-trail{fill:none;stroke:var(--pj-glow);stroke-width:2.6;stroke-linecap:round;opacity:.45}
.phuljhari .pj-line{fill:none;stroke:var(--pj-spark);stroke-width:.9;stroke-linecap:round}
.phuljhari .pj-core{fill:#FFFFFF}
.phuljhari .pj-halo{fill:var(--pj-spark)}
.phuljhari .pj-ember{fill:var(--pj-hot)}

.phuljhari[data-lit="false"] .pj-fire{display:none}

/* every spark shoots out from the tip, fades, and restarts */
.phuljhari .pj-s{transform-box:view-box;transform-origin:104px 56px;animation:pj-burst .7s ease-out infinite}
.phuljhari .pj-glow{transform-box:fill-box;transform-origin:50% 50%;animation:pj-pulse .18s ease-in-out infinite alternate}
.phuljhari .pj-ember{animation:pj-fall 1.4s ease-in infinite}
.phuljhari .k0{animation-duration:0.54s;animation-delay:-0.42s}
.phuljhari .k1{animation-duration:0.50s;animation-delay:-0.34s}
.phuljhari .k2{animation-duration:0.53s;animation-delay:-0.53s}
.phuljhari .k3{animation-duration:0.52s;animation-delay:-0.31s}
.phuljhari .k4{animation-duration:0.54s;animation-delay:-0.52s}
.phuljhari .k5{animation-duration:0.41s;animation-delay:-0.41s}
.phuljhari .k6{animation-duration:0.50s;animation-delay:-0.23s}
.phuljhari .k7{animation-duration:0.58s;animation-delay:-0.56s}
.phuljhari .k8{animation-duration:0.34s;animation-delay:-0.04s}
.phuljhari .k9{animation-duration:0.45s;animation-delay:-0.21s}
.phuljhari .k10{animation-duration:0.46s;animation-delay:-0.24s}
.phuljhari .k11{animation-duration:0.58s;animation-delay:-0.01s}
.phuljhari .k12{animation-duration:0.41s;animation-delay:-0.08s}
.phuljhari .k13{animation-duration:0.29s;animation-delay:-0.19s}
.phuljhari .k14{animation-duration:0.34s;animation-delay:-0.06s}
.phuljhari .k15{animation-duration:0.31s;animation-delay:-0.07s}
.phuljhari .k16{animation-duration:0.48s;animation-delay:-0.13s}
.phuljhari .k17{animation-duration:0.34s;animation-delay:-0.21s}
.phuljhari .k18{animation-duration:0.41s;animation-delay:-0.01s}
.phuljhari .k19{animation-duration:0.57s;animation-delay:-0.22s}
.phuljhari .k20{animation-duration:0.57s;animation-delay:-0.17s}
.phuljhari .k21{animation-duration:0.32s;animation-delay:-0.04s}
.phuljhari .k22{animation-duration:0.49s;animation-delay:-0.20s}
.phuljhari .k23{animation-duration:0.31s;animation-delay:-0.06s}
.phuljhari .k24{animation-duration:0.39s;animation-delay:-0.20s}
.phuljhari .k25{animation-duration:0.36s;animation-delay:-0.02s}
.phuljhari .k26{animation-duration:0.45s;animation-delay:-0.21s}
.phuljhari .k27{animation-duration:0.56s;animation-delay:-0.30s}
.phuljhari .k28{animation-duration:0.33s;animation-delay:-0.17s}
.phuljhari .k29{animation-duration:0.28s;animation-delay:-0.17s}
.phuljhari .k30{animation-duration:0.59s;animation-delay:-0.59s}
.phuljhari .k31{animation-duration:0.31s;animation-delay:-0.26s}
.phuljhari .k32{animation-duration:0.53s;animation-delay:-0.42s}
.phuljhari .k33{animation-duration:0.38s;animation-delay:-0.07s}
.phuljhari .k34{animation-duration:0.39s;animation-delay:-0.32s}
.phuljhari .k35{animation-duration:0.35s;animation-delay:-0.34s}
.phuljhari .e0{animation-duration:0.85s;animation-delay:-0.34s}
.phuljhari .e1{animation-duration:0.79s;animation-delay:-0.54s}
.phuljhari .e2{animation-duration:1.10s;animation-delay:-0.74s}
.phuljhari .e3{animation-duration:0.79s;animation-delay:-0.73s}
.phuljhari .e4{animation-duration:0.75s;animation-delay:-0.25s}
@keyframes pj-burst{0%{transform:scale(.12);opacity:0}8%{opacity:1}65%{opacity:1}100%{transform:scale(1);opacity:0}}
@keyframes pj-pulse{from{transform:scale(.92);opacity:.85}to{transform:scale(1.06);opacity:1}}
@keyframes pj-fall{0%{transform:translateY(0);opacity:1}100%{transform:translateY(36px);opacity:0}}
@media (prefers-reduced-motion:reduce){.phuljhari *{animation:none !important}}
`;

export function Phuljhari({ lit = true, size = 160, title = "Sparkling phuljhari", className = "", style }: IconProps) {
  return (
    <svg
      className={`phuljhari ${className}`}
      viewBox="0 0 160 160"
      width={size}
      height={size}
      data-lit={String(lit)}
      role="img"
      aria-label={title}
      style={style}
    >
      <style>{PHULJHARI_CSS}</style>
      <defs>
        <radialGradient id="pj-glow-grad">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset=".18" stopColor="#FFF6D5" stopOpacity=".95" />
          <stop offset=".45" stopColor="#FFB627" stopOpacity=".45" />
          <stop offset="1" stopColor="#FF7A1A" stopOpacity="0" />
        </radialGradient>
        <filter id="pj-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>

      {/* ROD: bare wire handle + grey coated part + burnt end near the tip */}
      <path className="pj-wire" d="M34 150 L70 98" />
      <path className="pj-rod" d="M70 98 L101.3 59.4" />
        <circle className="pj-fleck" cx="80.8" cy="85.2" r="0.9" />
        <circle className="pj-fleck" cx="73.4" cy="91.7" r="0.7" />
        <circle className="pj-fleck" cx="97.5" cy="64.7" r="0.6" />
        <circle className="pj-fleck" cx="93.7" cy="67.9" r="1" />
        <circle className="pj-fleck" cx="98.2" cy="64" r="0.6" />
        <circle className="pj-fleck" cx="96.6" cy="63.6" r="0.9" />
        <circle className="pj-fleck" cx="81.1" cy="82.3" r="0.9" />
        <circle className="pj-fleck" cx="79.7" cy="86.9" r="0.7" />
        <circle className="pj-fleck" cx="91.7" cy="69.8" r="1" />
        <circle className="pj-fleck" cx="72.6" cy="98.1" r="1" />
        <circle className="pj-fleck" cx="89.5" cy="73.7" r="0.8" />
        <circle className="pj-fleck" cx="75.2" cy="91.5" r="0.9" />
        <circle className="pj-fleck" cx="100.3" cy="61" r="1.1" />
        <circle className="pj-fleck" cx="93.4" cy="69.3" r="0.8" />
      <path className="pj-burnt" d="M99.2 61.9 L104 56" />

      {/* FIRE (hidden when data-lit="false") */}
      <g className="pj-fire">
        <circle className="pj-glow" cx="104" cy="56" r="34" fill="url(#pj-glow-grad)" />
        <g className="pj-sparks">
          <g className="pj-s k0"><path className="pj-trail" d="M107.7 59.4 Q115.5 67.4 124.8 77.4 M119.8 72 L129.2 74.3" /><path className="pj-line" d="M107.7 59.4 Q115.5 67.4 124.8 77.4 M119.8 72 L129.2 74.3" /></g>
          <g className="pj-s k1"><path className="pj-trail" d="M99 56.3 Q84.3 58.1 68.3 61.3 M83.1 58.6 L74 67.8" /><path className="pj-line" d="M99 56.3 Q84.3 58.1 68.3 61.3 M83.1 58.6 L74 67.8" /></g>
          <g className="pj-s k2"><path className="pj-trail" d="M105.2 60.8 Q106.9 68.1 109.3 78.1" /><path className="pj-line" d="M105.2 60.8 Q106.9 68.1 109.3 78.1" /></g>
          <g className="pj-s k3"><path className="pj-trail" d="M99 55.6 Q94.8 55.7 87.3 55.3 M92.6 55.5 L87.9 51.5 M92.2 55.5 L85.9 58.1 M87.3 55.3 L83.8 55.7 M87.3 55.3 L83.7 54.2 M87.3 55.3 L84.8 58.1" /><path className="pj-line" d="M99 55.6 Q94.8 55.7 87.3 55.3 M92.6 55.5 L87.9 51.5 M92.2 55.5 L85.9 58.1 M87.3 55.3 L83.8 55.7 M87.3 55.3 L83.7 54.2 M87.3 55.3 L84.8 58.1" /></g>
          <g className="pj-s k4"><path className="pj-trail" d="M99 56.3 Q82.2 58.3 64.3 62.3 M77.5 59.6 L65.6 52.6" /><path className="pj-line" d="M99 56.3 Q82.2 58.3 64.3 62.3 M77.5 59.6 L65.6 52.6" /></g>
          <g className="pj-s k5"><path className="pj-trail" d="M99.1 55.3 Q86 54.3 71.3 54 M84.6 54.4 L75.4 45.3 M71.3 54 L68 51.5 M71.3 54 L67.5 51 M71.3 54 L70.6 51" /><path className="pj-line" d="M99.1 55.3 Q86 54.3 71.3 54 M84.6 54.4 L75.4 45.3 M71.3 54 L68 51.5 M71.3 54 L67.5 51 M71.3 54 L70.6 51" /></g>
          <g className="pj-s k6"><path className="pj-trail" d="M99.2 54.5 Q87 51.6 73.1 49.1 M85.3 51.4 L80.7 45.4 M73.1 49.1 L71.5 44.4 M73.1 49.1 L70.7 44.9 M73.1 49.1 L70.1 49.2" /><path className="pj-line" d="M99.2 54.5 Q87 51.6 73.1 49.1 M85.3 51.4 L80.7 45.4 M73.1 49.1 L71.5 44.4 M73.1 49.1 L70.7 44.9 M73.1 49.1 L70.1 49.2" /></g>
          <g className="pj-s k7"><path className="pj-trail" d="M104.5 51 Q105.6 41.3 107 29.9 M105.9 39.2 L101.6 33.6 M106.1 37.2 L113 30.9" /><path className="pj-line" d="M104.5 51 Q105.6 41.3 107 29.9 M105.9 39.2 L101.6 33.6 M106.1 37.2 L113 30.9" /></g>
          <g className="pj-s k8"><path className="pj-trail" d="M106.7 51.8 Q112.4 44 119.2 34.8 M113.9 42 L123.9 37.1 M119.2 34.8 L122 34.8 M119.2 34.8 L121 31.3 M119.2 34.8 L123.2 34.1" /><path className="pj-line" d="M106.7 51.8 Q112.4 44 119.2 34.8 M113.9 42 L123.9 37.1 M119.2 34.8 L122 34.8 M119.2 34.8 L121 31.3 M119.2 34.8 L123.2 34.1" /></g>
          <g className="pj-s k9"><path className="pj-trail" d="M108.8 57.4 Q119.7 61.3 132.5 66.5 M120.2 61.6 L126.9 71 M125.7 63.8 L136.3 60.3" /><path className="pj-line" d="M108.8 57.4 Q119.7 61.3 132.5 66.5 M120.2 61.6 L126.9 71 M125.7 63.8 L136.3 60.3" /></g>
          <g className="pj-s k10"><path className="pj-trail" d="M107.4 59.7 Q115.6 69.4 125.1 81.3 M117.8 72.2 L125.7 76.2" /><path className="pj-line" d="M107.4 59.7 Q115.6 69.4 125.1 81.3 M117.8 72.2 L125.7 76.2" /></g>
          <g className="pj-s k11"><path className="pj-trail" d="M100.1 59.2 Q96 63.1 89.5 68.8 M89.5 68.8 L86.4 67.4 M89.5 68.8 L90.2 73.3 M89.5 68.8 L84.9 70.4" /><path className="pj-line" d="M100.1 59.2 Q96 63.1 89.5 68.8 M89.5 68.8 L86.4 67.4 M89.5 68.8 L90.2 73.3 M89.5 68.8 L84.9 70.4" /></g>
          <g className="pj-s k12"><path className="pj-trail" d="M99.1 56.8 Q85.9 59.7 71 63.9 M78.7 61.7 L66.3 57.2 M71 63.9 L67.5 64.2 M71 63.9 L67.6 66 M71 63.9 L68.5 63.1" /><path className="pj-line" d="M99.1 56.8 Q85.9 59.7 71 63.9 M78.7 61.7 L66.3 57.2 M71 63.9 L67.5 64.2 M71 63.9 L67.6 66 M71 63.9 L68.5 63.1" /></g>
          <g className="pj-s k13"><path className="pj-trail" d="M108.4 53.6 Q111.7 52.3 118 49.1 M114.7 50.8 L120.2 51.9" /><path className="pj-line" d="M108.4 53.6 Q111.7 52.3 118 49.1 M114.7 50.8 L120.2 51.9" /></g>
          <g className="pj-s k14"><path className="pj-trail" d="M105 60.9 Q108.2 78 111.6 97.9 M111.6 97.9 L111 100.8 M111.6 97.9 L114.2 100.7 M111.6 97.9 L109.3 100.6" /><path className="pj-line" d="M105 60.9 Q108.2 78 111.6 97.9 M111.6 97.9 L111 100.8 M111.6 97.9 L114.2 100.7 M111.6 97.9 L109.3 100.6" /></g>
          <g className="pj-s k15"><path className="pj-trail" d="M99.1 57.1 Q81.5 62.3 63.1 70 M63.1 70 L61.1 73.2 M63.1 70 L59.5 71.3 M63.1 70 L60 70.5" /><path className="pj-line" d="M99.1 57.1 Q81.5 62.3 63.1 70 M63.1 70 L61.1 73.2 M63.1 70 L59.5 71.3 M63.1 70 L60 70.5" /></g>
          <g className="pj-s k16"><path className="pj-trail" d="M109 56.2 Q113.5 56.8 121.2 57.3 M116 56.9 L121.5 62.2 M121.2 57.3 L123.2 53.1 M121.2 57.3 L125.2 55.9 M121.2 57.3 L123.5 59.4" /><path className="pj-line" d="M109 56.2 Q113.5 56.8 121.2 57.3 M116 56.9 L121.5 62.2 M121.2 57.3 L123.2 53.1 M121.2 57.3 L125.2 55.9 M121.2 57.3 L123.5 59.4" /></g>
          <g className="pj-s k17"><path className="pj-trail" d="M104 51 Q104.1 37.9 104.3 24.4 M104.2 37.1 L111.3 25 M104.2 36.7 L96.1 26.5" /><path className="pj-line" d="M104 51 Q104.1 37.9 104.3 24.4 M104.2 37.1 L111.3 25 M104.2 36.7 L96.1 26.5" /></g>
          <g className="pj-s k18"><path className="pj-trail" d="M99 55.8 Q91.8 56.1 81.8 56.3 M81.8 56.3 L78.9 57.6 M81.8 56.3 L79.9 59.4 M81.8 56.3 L79.4 52.6" /><path className="pj-line" d="M99 55.8 Q91.8 56.1 81.8 56.3 M81.8 56.3 L78.9 57.6 M81.8 56.3 L79.9 59.4 M81.8 56.3 L79.4 52.6" /></g>
          <g className="pj-s k19"><path className="pj-trail" d="M108.1 58.8 Q110.9 61.2 116.6 65.3 M113.4 63 L115.5 69 M113 62.7 L117.8 62.6 M116.6 65.3 L120.9 67.8 M116.6 65.3 L116.8 69.5 M116.6 65.3 L116.9 69.5" /><path className="pj-line" d="M108.1 58.8 Q110.9 61.2 116.6 65.3 M113.4 63 L115.5 69 M113 62.7 L117.8 62.6 M116.6 65.3 L120.9 67.8 M116.6 65.3 L116.8 69.5 M116.6 65.3 L116.9 69.5" /></g>
          <g className="pj-s k20"><path className="pj-trail" d="M108.7 54.4 Q116.7 52.3 127.1 49.6 M118.6 51.8 L125.1 45.5" /><path className="pj-line" d="M108.7 54.4 Q116.7 52.3 127.1 49.6 M118.6 51.8 L125.1 45.5" /></g>
          <g className="pj-s k21"><path className="pj-trail" d="M99.7 58.5 Q89.4 65.3 77.4 73.8 M85.8 67.9 L82.5 76.3" /><path className="pj-line" d="M99.7 58.5 Q89.4 65.3 77.4 73.8 M85.8 67.9 L82.5 76.3" /></g>
          <g className="pj-s k22"><path className="pj-trail" d="M101 60 Q93.2 71 84.3 84.4 M90.5 75.2 L80.8 80.3 M84.3 84.4 L82.9 87.1 M84.3 84.4 L85.3 88.1 M84.3 84.4 L80.1 86.8" /><path className="pj-line" d="M101 60 Q93.2 71 84.3 84.4 M90.5 75.2 L80.8 80.3 M84.3 84.4 L82.9 87.1 M84.3 84.4 L85.3 88.1 M84.3 84.4 L80.1 86.8" /></g>
          <g className="pj-s k23"><path className="pj-trail" d="M103.8 61 Q103.7 66.8 103.4 75.6 M103.6 69.1 L100.1 73.4" /><path className="pj-line" d="M103.8 61 Q103.7 66.8 103.4 75.6 M103.6 69.1 L100.1 73.4" /></g>
          <g className="pj-s k24"><path className="pj-trail" d="M108.9 57.2 Q124.5 62 141.3 68.9" /><path className="pj-line" d="M108.9 57.2 Q124.5 62 141.3 68.9" /></g>
          <g className="pj-s k25"><path className="pj-trail" d="M103.8 51 Q103.6 47.5 103.3 40.5" /><path className="pj-line" d="M103.8 51 Q103.6 47.5 103.3 40.5" /></g>
          <g className="pj-s k26"><path className="pj-trail" d="M104.9 60.9 Q106.8 72.2 109 86.2 M107.9 79.1 L104.5 91.6 M107.2 75.1 L112.6 83.4" /><path className="pj-line" d="M104.9 60.9 Q106.8 72.2 109 86.2 M107.9 79.1 L104.5 91.6 M107.2 75.1 L112.6 83.4" /></g>
          <g className="pj-s k27"><path className="pj-trail" d="M105.2 51.1 Q108 40.5 111.3 28.7 M108.9 37.5 L114.7 30.5 M109.6 34.8 L106.4 26.1 M111.3 28.7 L109.6 26 M111.3 28.7 L112.4 25.8 M111.3 28.7 L113.3 26.8" /><path className="pj-line" d="M105.2 51.1 Q108 40.5 111.3 28.7 M108.9 37.5 L114.7 30.5 M109.6 34.8 L106.4 26.1 M111.3 28.7 L109.6 26 M111.3 28.7 L112.4 25.8 M111.3 28.7 L113.3 26.8" /></g>
          <g className="pj-s k28"><path className="pj-trail" d="M106.9 52 Q114.9 41.9 123.8 31.6 M116.7 39.9 L128.3 38.3" /><path className="pj-line" d="M106.9 52 Q114.9 41.9 123.8 31.6 M116.7 39.9 L128.3 38.3" /></g>
          <g className="pj-s k29"><path className="pj-trail" d="M108.3 58.6 Q120.4 66.7 133.8 76.9 M121 67.4 L127 81.4 M133.8 76.9 L137.7 77 M133.8 76.9 L138.7 77.8 M133.8 76.9 L138.1 75.9" /><path className="pj-line" d="M108.3 58.6 Q120.4 66.7 133.8 76.9 M121 67.4 L127 81.4 M133.8 76.9 L137.7 77 M133.8 76.9 L138.7 77.8 M133.8 76.9 L138.1 75.9" /></g>
          <g className="pj-s k30"><path className="pj-trail" d="M99 56.6 Q89.7 58.5 78 61.1" /><path className="pj-line" d="M99 56.6 Q89.7 58.5 78 61.1" /></g>
          <g className="pj-s k31"><path className="pj-trail" d="M106.4 60.4 Q111.6 70.7 117.7 83.4 M111.9 71.5 L120.7 79.1 M113.8 75.4 L112 88.4 M117.7 83.4 L120.9 85.6 M117.7 83.4 L118.5 86.5 M117.7 83.4 L121 83.8" /><path className="pj-line" d="M106.4 60.4 Q111.6 70.7 117.7 83.4 M111.9 71.5 L120.7 79.1 M113.8 75.4 L112 88.4 M117.7 83.4 L120.9 85.6 M117.7 83.4 L118.5 86.5 M117.7 83.4 L121 83.8" /></g>
          <g className="pj-s k32"><path className="pj-trail" d="M108.5 58.2 Q114.8 61.9 123.6 66.9 M117.2 63.3 L121.4 70.7 M123.6 66.9 L128.1 67.4 M123.6 66.9 L123.9 70.3 M123.6 66.9 L127.7 64.2" /><path className="pj-line" d="M108.5 58.2 Q114.8 61.9 123.6 66.9 M117.2 63.3 L121.4 70.7 M123.6 66.9 L128.1 67.4 M123.6 66.9 L123.9 70.3 M123.6 66.9 L127.7 64.2" /></g>
          <g className="pj-s k33"><path className="pj-trail" d="M103.5 61 Q102.3 74.8 100.9 91.4 M102 78 L93.1 87.9" /><path className="pj-line" d="M103.5 61 Q102.3 74.8 100.9 91.4 M102 78 L93.1 87.9" /></g>
          <g className="pj-s k34"><path className="pj-trail" d="M99.1 57.2 Q83.5 61.9 66.7 68.6" /><path className="pj-line" d="M99.1 57.2 Q83.5 61.9 66.7 68.6" /></g>
          <g className="pj-s k35"><path className="pj-trail" d="M99.8 53.3 Q94.5 50.5 86.7 46.1 M93 49.6 L86.6 50.9 M91 48.5 L88.4 43.9" /><path className="pj-line" d="M99.8 53.3 Q94.5 50.5 86.7 46.1 M93 49.6 L86.6 50.9 M91 48.5 L88.4 43.9" /></g>
        </g>
        <g className="pj-embers">
          <circle className="pj-ember e0" cx="106.7" cy="52.5" r="1" />
          <circle className="pj-ember e1" cx="83" cy="64.3" r="1.3" />
          <circle className="pj-ember e2" cx="122.6" cy="68.2" r="1.5" />
          <circle className="pj-ember e3" cx="106" cy="54.2" r="1.1" />
          <circle className="pj-ember e4" cx="113.9" cy="50.2" r="1.2" />
        </g>
        <circle className="pj-halo" cx="104" cy="56" r="8" filter="url(#pj-blur)" />
        <circle className="pj-core" cx="104" cy="56" r="4" />
      </g>
    </svg>
  );
}
