"use client";

import { useEffect } from "react";

const LOAD_MS = 3000; // measured from navigation start, so slow hydration doesn't add to it
const MAX_WAIT_MS = 1700; // longest we wait for the logo to finish a breath before moving on

/**
 * Ends the loading state. While `is-loading` is on <html>, the page shows only the logo breathing in a glow.
 * After ~3 seconds we remove it on a breath boundary, where the logo is at rest, so nothing jumps: the logo
 * stays put and the rest of the page builds in around it.
 */
export default function Loader() {
  useEffect(() => {
    const html = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!location.hash) scrollTo(0, 0);

    let opened = false, tWait = 0, tMax = 0;
    const open = () => {
      if (opened) return;
      opened = true;
      clearTimeout(tMax);
      html.classList.remove("is-loading");
    };
    if (reduced) { open(); return; }

    const wait = Math.max(0, LOAD_MS - performance.now());
    // Hold briefly for web fonts so the page doesn't build in with fallback text.
    const fonts = document.fonts?.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, wait + 1500))]) : Promise.resolve();
    tWait = window.setTimeout(() => fonts.then(() => {
      const pulse = document.querySelector<HTMLElement>(".logo-pulse");
      if (!pulse) return open();
      pulse.addEventListener("animationiteration", (e) => { if (e.target === pulse) open(); });
      tMax = window.setTimeout(open, MAX_WAIT_MS);
    }), wait);

    return () => { clearTimeout(tWait); clearTimeout(tMax); };
  }, []);

  return null;
}
