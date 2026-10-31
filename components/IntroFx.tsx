"use client";

import { useEffect } from "react";

const SPACING = 32;        // px between dots
const REACH = 150;         // px radius of the cursor's pull on the dots
const PULL = 0.55;         // fraction of the distance a dot travels towards the cursor, at the centre of the pull
const ARROW_REACH = 460;   // px within which arrows are also drawn slightly towards the cursor
const ease = 0.14;
// The logo asterisk has no single tip, so the arrows simply turn with the cursor angle (no offset needed).
const TIP_ANGLE = 0;

/**
 * Makes the intro stage react to the cursor: the orange asterisks turn with it (and lean towards it), and the
 * dot grid is pulled towards it, so the dots bunch up and darken to navy wherever it goes. The gradient glass background
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
      ? Array.from(document.querySelectorAll<HTMLElement>(".stage > .fw")).map((box) => ({ box, svg: box.querySelector("svg")!, angle: 0, init: false }))
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
      ctx.fillStyle = "rgba(17,52,98,.14)";
      ctx.beginPath();
      for (let y = 0; y < h; y += SPACING) {
        for (let x = 0; x < w; x += SPACING) {
          const dx = cx - x, dy = cy - y;
          const k = presence > 0.002 ? Math.exp(-(dx * dx + dy * dy) / two) * presence : 0;
          if (k < 0.02) { ctx.moveTo(x + 1.15, y); ctx.arc(x, y, 1.15, 0, 6.2832); continue; }
          near.push([x + dx * k * PULL, y + dy * k * PULL, k]);
        }
      }
      ctx.fill();
      for (const [x, y, k] of near) {
        ctx.fillStyle = `rgba(17,52,98,${(0.14 + 0.86 * k).toFixed(3)})`; // brand navy: reads clearly on the cream and against the orange blobs
        ctx.beginPath(); ctx.arc(x, y, 1.15 + 2.2 * k, 0, 6.2832); ctx.fill();
      }
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      cur.x += (target.x - cur.x) * ease; cur.y += (target.y - cur.y) * ease;
      presence += (presenceTarget - presence) * 0.08;
      // The gradient glass layers drift a little with the cursor (--gx/--gy are -1..1, eased like the cursor).
      // They also drive the 3D tilt of the logo. With no cursor (touch devices, or before the mouse moves) the logo sways on
      // its own, so the depth is visible; as soon as the cursor is over the page it takes over.
      const idle = reduced ? 0 : 1 - presence;
      const gx = Math.max(-1, Math.min(1, (cur.x - innerWidth / 2) / (innerWidth / 2))) * presence + Math.sin(t / 1500) * 0.62 * idle;
      const gy = Math.max(-1, Math.min(1, (cur.y - innerHeight / 2) / (innerHeight / 2))) * presence + Math.cos(t / 1900) * 0.4 * idle;
      stage.style.setProperty("--gx", gx.toFixed(3));
      stage.style.setProperty("--gy", gy.toFixed(3));
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
