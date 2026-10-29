"use client";

import { useEffect } from "react";

const SPACING = 30;        // px between dots
const REACH = 150;         // px radius of the cursor's pull on the dots
const PULL = 0.55;         // fraction of the distance a dot travels towards the cursor, at the centre of the pull
const ARROW_REACH = 460;   // px within which arrows are also drawn slightly towards the cursor
const ease = 0.14;
// The wedge symbol (viewBox 128 x 120) has its sharp tip at the top right corner (128, 0). Measured from the centre (64, 60).
const TIP_ANGLE = (Math.atan2(-60, 64) * 180) / Math.PI;

/**
 * Makes the intro stage react to the cursor: the orange arrows turn to point at it (and lean towards it), and the
 * dot grid is pulled towards it, so the dots bunch up and glow orange wherever it goes. The gradient glass background
 * (blobs and frosted panes in Intro.tsx / globals.css) also shifts slightly with it.
 * Arrows are only driven for fine pointers; touch devices keep their slow spin.
 */
export default function IntroFx() {
  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(".dot-grid");
    const stage = document.getElementById("stage");
    if (!canvas || !stage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const arrows = fine && !reduced
      ? Array.from(document.querySelectorAll<HTMLElement>(".stage > .fw")).map((box) => ({ box, svg: (box.querySelector(".fw-rot") ?? box.querySelector("svg")) as HTMLElement, angle: 0, init: false }))
      : [];

    // Until the cursor moves, arrows point at the middle of the screen (the logo) and the dots rest in a plain grid.
    const target = { x: innerWidth / 2, y: innerHeight / 2 }, cur = { ...target };
    let presence = 0, presenceTarget = 0, dpr = 1, w = 0, h = 0, dirty = true, visible = true, raf = 0;

    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      w = stage.clientWidth; h = stage.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      dirty = true;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cr = canvas.getBoundingClientRect();
      const cx = cur.x - cr.left, cy = cur.y - cr.top;
      const two = 2 * REACH * REACH;
      const near: [number, number, number][] = [];
      ctx.fillStyle = "rgba(255,255,255,.075)";
      ctx.beginPath();
      for (let y = SPACING / 2; y < h; y += SPACING) {
        for (let x = SPACING / 2; x < w; x += SPACING) {
          const dx = cx - x, dy = cy - y;
          const k = presence > 0.002 ? Math.exp(-(dx * dx + dy * dy) / two) * presence : 0;
          if (k < 0.02) { ctx.moveTo(x + 1.15, y); ctx.arc(x, y, 1.15, 0, 6.2832); continue; }
          near.push([x + dx * k * PULL, y + dy * k * PULL, k]);
        }
      }
      ctx.fill();
      for (const [x, y, k] of near) {
        ctx.fillStyle = `rgba(${Math.round(255 - 25 * k)},${Math.round(255 - 149 * k)},${Math.round(255 - 211 * k)},${(0.075 + 0.75 * k).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, 1.15 + 1.6 * k, 0, 6.2832); ctx.fill();
      }
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      cur.x += (target.x - cur.x) * ease; cur.y += (target.y - cur.y) * ease;
      presence += (presenceTarget - presence) * 0.08;
      // The gradient glass layers drift a little with the cursor (--gx/--gy are -1..1, eased like the cursor).
      stage.style.setProperty("--gx", Math.max(-1, Math.min(1, (cur.x - innerWidth / 2) / (innerWidth / 2))).toFixed(3));
      stage.style.setProperty("--gy", Math.max(-1, Math.min(1, (cur.y - innerHeight / 2) / (innerHeight / 2))).toFixed(3));
      if (Math.abs(target.x - cur.x) > 0.2 || Math.abs(target.y - cur.y) > 0.2 || Math.abs(presenceTarget - presence) > 0.002) dirty = true;
      if (dirty) { draw(); dirty = false; }

      for (const a of arrows) {
        const r = a.box.getBoundingClientRect();
        const bx = r.left + r.width / 2, by = r.top + r.height / 2;
        const dx = cur.x - bx, dy = cur.y - by, d = Math.hypot(dx, dy) || 1;
        // Rotate so the shape's tip faces the cursor, taking the short way round.
        const want = (Math.atan2(dy, dx) * 180) / Math.PI - TIP_ANGLE;
        if (!a.init) { a.angle = want; a.init = true; }
        a.angle += (((want - a.angle) % 360 + 540) % 360 - 180) * 0.16;
        const lean = 16 * Math.exp(-((d / ARROW_REACH) ** 2)) * presence;
        a.svg.style.transform = `translate(${(dx / d) * lean}px,${(dy / d) * lean}px) rotate(${a.angle}deg)`;
      }
    };

    const move = (e: PointerEvent) => { target.x = e.clientX; target.y = e.clientY; presenceTarget = 1; };
    const leave = () => { presenceTarget = 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; dirty = true; });
    io.observe(stage);

    resize();
    if (!reduced) {
      addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("mouseleave", leave);
    }
    addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      removeEventListener("pointermove", move); removeEventListener("resize", resize);
      document.documentElement.removeEventListener("mouseleave", leave);
      arrows.forEach((a) => { a.svg.style.transform = ""; });
    };
  }, []);

  return null;
}
