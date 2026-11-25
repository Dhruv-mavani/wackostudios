"use client";

import { useEffect, useRef } from "react";
import { SERVICES } from "@/lib/data";

/**
 * Drives the Services section: as the pinned section scrolls past, the active service changes (list highlight, counter,
 * progress bar) and the bending glass sheet turns to show it. three.js is only downloaded when the section is close.
 * With reduced motion, or no WebGL, the section shows plain cards instead (class `sv-flat` on the section).
 */
export default function ServiceGlass() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current, sec = document.getElementById("services");
    if (!cv || !sec) return;
    const N = SERVICES.length;
    const items = Array.from(sec.querySelectorAll<HTMLElement>(".sv-item"));
    const count = sec.querySelector<HTMLElement>("#svCount"), name = sec.querySelector<HTMLElement>("#svName");
    const bar = sec.querySelector<HTMLElement>("#svBar");
    const flat = () => sec.classList.add("sv-flat");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { flat(); return; }

    let sheet: { show(i: number): void; start(): void; stop(): void; resize(): void; dispose(): void } | null = null;
    let active = -1, raf = 0, near = false, loading = false, alive = true;

    const progress = () => {
      const r = sec.getBoundingClientRect();
      return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
    };
    const update = () => {
      raf = 0;
      const p = progress(), i = Math.min(N - 1, Math.floor(p * N));
      if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
      if (i === active) return;
      active = i;
      items.forEach((el, k) => { el.classList.toggle("on", k === i); el.setAttribute("aria-current", k === i ? "true" : "false"); });
      if (count) count.textContent = `${String(i + 1).padStart(2, "0")} / ${N}`;
      if (name) name.textContent = SERVICES[i].n;
      sheet?.show(i);
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(update); };

    const load = async () => {
      loading = true;
      try {
        const { createGlassSheet } = await import("@/lib/glassSheet");
        if (document.fonts?.ready) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
        if (!alive) return;
        const cs = getComputedStyle(sec);
        const display = getComputedStyle(sec.querySelector("h2") ?? sec).fontFamily, body = cs.fontFamily;
        sheet = createGlassSheet(cv, SERVICES, { display, body });
        sheet.show(Math.max(0, active));
        sec.classList.add("sv-live");
        if (near) sheet.start();
      } catch {
        flat(); // no WebGL: plain cards
      }
    };

    // Clicking a name scrolls to that service's slot.
    const jump = (e: Event) => {
      const el = (e.currentTarget as HTMLElement), k = +(el.dataset.i ?? 0);
      const top = sec.getBoundingClientRect().top + scrollY, span = sec.offsetHeight - innerHeight;
      scrollTo({ top: top + ((k + 0.5) / N) * span, behavior: "smooth" });
    };
    items.forEach((el) => el.addEventListener("click", jump));

    const io = new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (near && !sheet && !loading) void load();
      if (sheet) { if (near) sheet.start(); else sheet.stop(); }
    }, { rootMargin: "60% 0px" });
    io.observe(sec);
    const ro = new ResizeObserver(() => sheet?.resize()); ro.observe(cv);
    addEventListener("scroll", ask, { passive: true }); addEventListener("resize", ask);
    update();

    return () => {
      alive = false; io.disconnect(); ro.disconnect();
      removeEventListener("scroll", ask); removeEventListener("resize", ask); if (raf) cancelAnimationFrame(raf);
      items.forEach((el) => el.removeEventListener("click", jump));
      sheet?.dispose(); sheet = null;
    };
  }, []);

  return <canvas ref={canvas} className="sv-canvas" aria-hidden="true" />;
}
