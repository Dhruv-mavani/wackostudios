/*
 * Waz · Wacko Studios chatbot character (React / Next.js), ported to TypeScript from the designer's Waz.jsx.
 * The markup and CSS below are unchanged from waz.svg, so a new expression or movement can be pasted straight in.
 * Changes from the original: types, a `bare` prop (skip the inline <style> when <WazStyle /> is mounted once), and the
 * site palette is applied by the caller through --waz-skin / --waz-ink.
 *
 * Usage:
 *   import Waz from "./Waz";
 *   <Waz mood="happy" move="wave" size={160} />
 *   <Waz mood="thinking" move="typing" crop="head" size={44} />   // chat avatar
 *
 * mood: happy | thinking | excited | confused | oops | wink
 * move: idle | wave | talk | think | bounce | shake | typing | none
 * Recolour by setting CSS variables on the svg (style prop or a parent):
 *   --waz-skin (orange), --waz-ink (navy), --waz-white
 */

import type { CSSProperties } from "react";

export const WAZ_MOODS = ["happy", "thinking", "excited", "confused", "oops", "wink"] as const;
export const WAZ_MOVES = ["idle", "wave", "talk", "think", "bounce", "shake", "typing", "none"] as const;
export type WazMood = (typeof WAZ_MOODS)[number];
export type WazMove = (typeof WAZ_MOVES)[number];

export const WAZ_CSS = `
/* ============================================================
   WAZ · Wacko Studios chatbot character
   Switch expression:  data-mood = happy | thinking | excited | confused | oops | wink
   Switch movement:    data-move = idle | wave | talk | think | bounce | shake | typing | none
   Recolour:           --waz-skin, --waz-ink, --waz-white
   ============================================================ */
.waz{--waz-skin:#E66A2C;--waz-ink:#172033;--waz-white:#FFFFFF;overflow:visible}

/* ---- paint classes (no colours live in the markup) ---- */
.waz .skin{fill:var(--waz-skin)}
.waz .ink{fill:var(--waz-ink)}
.waz .white{fill:var(--waz-white)}
.waz .shade{fill:var(--waz-ink);opacity:.12}
.waz .line{fill:none;stroke:var(--waz-ink);stroke-linecap:round;stroke-linejoin:round}
.waz .line-skin{fill:none;stroke:var(--waz-skin);stroke-linecap:round;stroke-linejoin:round}
.waz .outline{stroke:var(--waz-ink);stroke-width:3;stroke-linejoin:round;outline:none} /* outline:none: Tailwind ships its own .outline utility that would draw a box around each shape */
.waz .s2{stroke-width:2}.waz .s4{stroke-width:4}.waz .s6{stroke-width:6}.waz .s7{stroke-width:7}.waz .s13{stroke-width:13}

/* ---- expressions: only the face matching data-mood is shown ---- */
.waz .face{display:none}
.waz[data-mood="happy"] .face-happy,
.waz[data-mood="thinking"] .face-thinking,
.waz[data-mood="excited"] .face-excited,
.waz[data-mood="confused"] .face-confused,
.waz[data-mood="oops"] .face-oops,
.waz[data-mood="wink"] .face-wink{display:inline}

/* ---- pivots for every moving part (user units of the 200x222 viewBox) ---- */
.waz .w-rig{transform-box:view-box;transform-origin:100px 212px}
.waz .w-head{transform-box:view-box;transform-origin:100px 152px}
.waz .w-arm-right{transform-box:view-box;transform-origin:134px 162px}
.waz .w-arm-left{transform-box:view-box;transform-origin:66px 164px}
.waz .w-shadow{transform-box:fill-box;transform-origin:50% 50%}
.waz .w-eyes{transform-box:fill-box;transform-origin:50% 50%}
.waz .w-mouth{transform-box:fill-box;transform-origin:50% 0%}

/* ---- movements ---- */
/* blink runs in every movement except "none" (faces with closed eyes have no .w-eyes) */
.waz:not([data-move="none"]) .w-eyes{animation:waz-blink 4.2s infinite}

.waz[data-move="idle"] .w-rig{animation:waz-bob 2.6s ease-in-out infinite}
.waz[data-move="idle"] .w-head{animation:waz-nod 5.2s ease-in-out infinite}

.waz[data-move="wave"] .w-rig{animation:waz-bob 2.6s ease-in-out infinite}
.waz[data-move="wave"] .w-arm-right{animation:waz-wave .45s ease-in-out infinite alternate}
.waz[data-move="wave"] .w-head{animation:waz-nod 1.8s ease-in-out infinite}

.waz[data-move="talk"] .w-mouth{animation:waz-talk .16s ease-in-out infinite alternate}
.waz[data-move="talk"] .w-head{animation:waz-talkhead .7s ease-in-out infinite}
.waz[data-move="talk"] .w-arm-right{animation:waz-gesture 1.4s ease-in-out infinite}

.waz[data-move="think"] .w-head{animation:waz-think 3.2s ease-in-out infinite}
.waz[data-move="think"] .w-rig{animation:waz-bob 3.2s ease-in-out infinite}
.waz[data-move="think"] .w-dot{animation:waz-dot 1.2s ease-in-out infinite}
.waz[data-move="think"] .w-dot.d2{animation-delay:.2s}
.waz[data-move="think"] .w-dot.d3{animation-delay:.4s}

.waz[data-move="bounce"] .w-rig{animation:waz-bounce .9s ease-in-out infinite}
.waz[data-move="bounce"] .w-shadow{animation:waz-shadow .9s ease-in-out infinite}
.waz[data-move="bounce"] .w-arm-left{animation:waz-flap .45s ease-in-out infinite alternate}
.waz[data-move="bounce"] .w-arm-right{animation:waz-wave .45s ease-in-out infinite alternate}

.waz[data-move="shake"] .w-head{animation:waz-shake .8s ease-in-out infinite}
.waz[data-move="shake"] .w-arm-left{animation:waz-flap 1.6s ease-in-out infinite}

.waz[data-move="typing"] .w-rig{animation:waz-bob 1.2s ease-in-out infinite}
.waz[data-move="typing"] .w-arm-right{animation:waz-tap .22s ease-in-out infinite alternate}
.waz[data-move="typing"] .w-arm-left{animation:waz-tap .22s ease-in-out infinite alternate-reverse}
.waz[data-move="typing"] .w-head{animation:waz-nod 1.2s ease-in-out infinite}

@keyframes waz-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes waz-nod{0%,100%{transform:rotate(0)}50%{transform:rotate(2deg)}}
@keyframes waz-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes waz-wave{from{transform:rotate(-14deg)}to{transform:rotate(16deg)}}
@keyframes waz-talk{from{transform:scaleY(1)}to{transform:scaleY(.55)}}
@keyframes waz-talkhead{0%,100%{transform:rotate(0)}50%{transform:rotate(-2.5deg)}}
@keyframes waz-gesture{0%,100%{transform:rotate(0)}50%{transform:rotate(-10deg)}}
@keyframes waz-think{0%,100%{transform:rotate(0)}30%,70%{transform:rotate(-7deg)}}
@keyframes waz-dot{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes waz-bounce{0%,100%{transform:translateY(0) scale(1,1)}10%{transform:translateY(0) scale(1.04,.94)}40%{transform:translateY(-18px) scale(.97,1.04)}70%{transform:translateY(0) scale(1.03,.96)}}
@keyframes waz-shadow{0%,100%{transform:scale(1)}40%{transform:scale(.7)}}
@keyframes waz-shake{0%,100%{transform:rotate(0)}15%{transform:rotate(-7deg)}35%{transform:rotate(6deg)}55%{transform:rotate(-4deg)}75%{transform:rotate(2deg)}}
@keyframes waz-flap{from{transform:rotate(0)}to{transform:rotate(28deg)}}
@keyframes waz-tap{from{transform:rotate(0)}to{transform:rotate(9deg)}}

@media (prefers-reduced-motion:reduce){.waz *{animation:none !important}}
`;

/** Mount once on a page that shows several Waz avatars; pass `bare` to each of them. */
export function WazStyle() {
  return <style>{WAZ_CSS}</style>;
}

export default function Waz({
  mood = "happy",
  move = "idle",
  size = 200,
  crop = "full", // "full" = whole body, "head" = head only, "avatar" = head plus the waving hand, sized to sit inside a circle
  title = "Wacky, the Wacko Studios chatbot",
  className = "",
  style,
  bare = false,
}: {
  mood?: WazMood;
  move?: WazMove;
  size?: number;
  crop?: "full" | "head" | "avatar";
  title?: string;
  className?: string;
  style?: CSSProperties;
  bare?: boolean;
}) {
  const square = crop !== "full";
  const viewBox = crop === "avatar" ? "20 -4 192 192" : crop === "head" ? "26 0 160 160" : "0 0 200 222";
  const height = square ? size : Math.round((size * 222) / 200);
  return (
    <svg
      className={`waz ${className}`}
      viewBox={viewBox}
      width={size}
      height={height}
      data-mood={mood}
      data-move={move}
      role="img"
      aria-label={title}
      style={style}
    >
      {!bare && <style>{WAZ_CSS}</style>}
      {/* ===================== RIG ===================== */}
      <ellipse className="shade w-shadow" cx="100" cy="212" rx="46" ry="6" />

      <g className="w-rig">

        {/* LEFT ARM (viewer's left), resting */}
        <g className="w-arm-left">
          <path className="line s13" d="M66 164 Q48 176 46 192" />
          <circle className="white outline" cx="46" cy="194" r="9" />
        </g>

        {/* RIGHT ARM, raised in a wave */}
        <g className="w-arm-right">
          <path className="line s13" d="M134 162 Q162 160 172 140" />
          <circle className="white outline" cx="174" cy="135" r="10" />
          <path className="line-skin s4" d="M188 120 Q194 131 189 142" />
        </g>

        {/* BODY */}
        <g className="w-body">
          <ellipse className="ink" cx="84" cy="205" rx="15" ry="7" />
          <ellipse className="ink" cx="116" cy="205" rx="15" ry="7" />
          <rect className="ink" x="60" y="146" width="80" height="56" rx="24" />
          {/* bow tie */}
          <path className="white" d="M87 153 L100 161 L87 169 Z" />
          <path className="white" d="M113 153 L100 161 L113 169 Z" />
          <circle className="skin" cx="100" cy="161" r="4" />
          {/* wedge badge */}
          <path className="skin" transform="translate(106 176) scale(.15)" d="M0 58 L128 0 Q88 58 83 120 Q60 80 0 58Z" />
        </g>

        {/* HEAD: base shape + quiff + freckles, then one group per expression */}
        <g className="w-head">
          <rect className="skin" x="40" y="48" width="120" height="106" rx="48" />
          {/* the quiff is the Wacko wedge */}
          <path className="ink" transform="translate(66 4) scale(.58)" d="M0 58 L128 0 Q88 58 83 120 Q60 80 0 58Z" />
          <circle className="ink" cx="141" cy="116" r="1.8" />
          <circle className="ink" cx="147" cy="121" r="1.8" />
          <circle className="ink" cx="139" cy="124" r="1.8" />

          {/* mood: happy (default, greeting) */}
          <g className="face face-happy">
            <g className="w-eyes">
              <circle className="white" cx="80" cy="100" r="17" />
              <circle className="white" cx="122" cy="97" r="21" />
              <circle className="ink" cx="84" cy="103" r="7.5" />
              <circle className="ink" cx="117" cy="93" r="9" />
              <circle className="white" cx="86.5" cy="100" r="2.5" />
              <circle className="white" cx="120" cy="89" r="3" />
            </g>
            <path className="line s6" d="M64 80 Q78 75 92 80" />
            <path className="line s7" d="M104 69 Q122 57 142 66" />
            <g className="w-mouth">
              <path className="ink outline" d="M74 126 Q104 152 134 120 Q106 134 74 126 Z" />
              <rect className="white" x="99" y="128" width="8" height="5" rx="1.5" />
            </g>
          </g>

          {/* mood: thinking */}
          <g className="face face-thinking">
            <g className="w-eyes">
              <circle className="white" cx="80" cy="100" r="17" />
              <circle className="white" cx="122" cy="97" r="21" />
              <circle className="ink" cx="75" cy="94" r="7.5" />
              <circle className="ink" cx="111" cy="88" r="9" />
              <circle className="white" cx="77.5" cy="91" r="2.5" />
              <circle className="white" cx="114" cy="84" r="3" />
            </g>
            <path className="line s6" d="M64 74 Q78 68 92 74" />
            <path className="line s7" d="M104 64 Q122 58 142 66" />
            <g className="w-mouth">
              <path className="line s6" d="M90 131 Q104 126 118 133" />
            </g>
            <circle className="ink w-dot d1" cx="152" cy="40" r="3.5" />
            <circle className="ink w-dot d2" cx="162" cy="27" r="5.5" />
            <circle className="ink w-dot d3" cx="176" cy="11" r="8" />
          </g>

          {/* mood: excited */}
          <g className="face face-excited">
            <path className="line s7" d="M66 102 Q80 86 94 102" />
            <path className="line s7" d="M106 100 Q122 80 138 100" />
            <path className="line s6" d="M64 72 Q80 64 94 72" />
            <path className="line s7" d="M104 64 Q122 54 140 62" />
            <g className="w-mouth">
              <path className="ink outline" d="M76 120 Q104 158 132 120 Z" />
              <rect className="white" x="86" y="120" width="36" height="6" rx="2" />
            </g>
          </g>

          {/* mood: confused */}
          <g className="face face-confused">
            <g className="w-eyes">
              <circle className="white" cx="80" cy="102" r="12" />
              <circle className="white" cx="122" cy="96" r="22" />
              <circle className="ink" cx="80" cy="103" r="5" />
              <circle className="ink" cx="125" cy="99" r="10" />
              <circle className="white" cx="82" cy="100.5" r="1.8" />
              <circle className="white" cx="128.5" cy="94.5" r="3" />
            </g>
            <path className="line s6" d="M66 84 L92 89" />
            <path className="line s7" d="M104 62 Q122 50 142 62" />
            <g className="w-mouth">
              <path className="line s6" d="M80 132 Q88 124 96 132 Q104 140 112 132 Q120 124 128 132" />
            </g>
            <path className="line s6" d="M152 30 Q152 16 164 16 Q176 16 176 27 Q176 35 165 38 V45" />
            <circle className="ink" cx="165" cy="55" r="4" />
          </g>

          {/* mood: oops (error, didn't work) */}
          <g className="face face-oops">
            <g className="w-eyes">
              <circle className="white" cx="80" cy="100" r="17" />
              <circle className="white" cx="122" cy="97" r="21" />
              <circle className="ink" cx="89" cy="101" r="6.5" />
              <circle className="ink" cx="131" cy="98" r="8" />
            </g>
            <path className="line s6" d="M66 82 Q78 76 92 73" />
            <path className="line s7" d="M104 72 Q120 73 140 80" />
            <g className="w-mouth">
              <rect className="ink" x="80" y="119" width="44" height="17" rx="7" />
              <rect className="white" x="84" y="123" width="36" height="9" rx="2.5" />
              <path className="line s2" d="M96 123 V132 M108 123 V132" />
            </g>
            <path className="white outline" d="M150 60 Q158 74 152 81 Q144 84 143 76 Q143 70 150 60 Z" />
          </g>

          {/* mood: wink (success, deal done) */}
          <g className="face face-wink">
            <path className="line s7" d="M66 101 Q80 110 94 101" />
            <g className="w-eyes">
              <circle className="white" cx="122" cy="97" r="21" />
              <circle className="ink" cx="124" cy="96" r="9" />
              <circle className="white" cx="127" cy="92" r="3" />
            </g>
            <path className="line s6" d="M64 88 Q78 86 92 90" />
            <path className="line s7" d="M104 66 Q122 55 142 63" />
            <g className="w-mouth">
              <path className="ink outline" d="M80 124 Q108 146 132 118 Q110 132 80 124 Z" />
            </g>
            <path className="skin outline" transform="translate(162 34)" d="M0 -11 L3 -3 L11 0 L3 3 L0 11 L-3 3 L-11 0 L-3 -3 Z" />
          </g>
        </g>
      </g>
    </svg>
  );
}
