"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const LOAD_MS = 3000; // measured from navigation start, so slow hydration doesn't add to it
const LOAD_MS_REDUCED = 500;
const UNFOLD_MS = 1400;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Glowing logo screen shown for ~3 seconds. It then splits open while the page (held back by the
 * `is-loading` class on <html>) scales up from behind it and the intro animation starts.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const total = matchMedia("(prefers-reduced-motion: reduce)").matches ? LOAD_MS_REDUCED : LOAD_MS;
    const html = document.documentElement;
    let raf = 0, tOpen = 0, tGone = 0;

    const tick = () => {
      const e = ease(clamp(performance.now() / total));
      if (bar.current) bar.current.style.transform = `scaleX(${e})`;
      if (pct.current) pct.current.textContent = `${Math.round(e * 100)}%`;
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    tick();

    const wait = Math.max(0, total - performance.now());
    const open = () => {
      root.current?.classList.add("open");
      html.classList.remove("is-loading");
      tGone = window.setTimeout(() => setGone(true), UNFOLD_MS);
    };
    // Hold briefly for web fonts so the page doesn't unfold with fallback text.
    const fonts = document.fonts?.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, wait + 1500))]) : Promise.resolve();
    tOpen = window.setTimeout(() => fonts.then(open), wait);

    return () => { cancelAnimationFrame(raf); clearTimeout(tOpen); clearTimeout(tGone); };
  }, []);

  if (gone) return null;
  return (
    <div className="loader" ref={root} role="status" aria-label="Loading Wacko Studios">
      <div className="loader-half t" />
      <div className="loader-half b" />
      <div className="loader-glow" aria-hidden="true" />
      <div className="loader-core">
        <Image className="loader-logo" src="/logo.webp" alt="Wacko Studios" width={1578} height={549} priority />
        <div className="loader-bar" aria-hidden="true"><i ref={bar} /></div>
        <span className="loader-pct" ref={pct} aria-hidden="true">0%</span>
      </div>
    </div>
  );
}
