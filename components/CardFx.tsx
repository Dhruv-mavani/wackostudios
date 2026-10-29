"use client";

import { useEffect } from "react";

/**
 * Makes each service card react to the cursor: sets --mx/--my (-1..1) so the illustration layers shift at
 * different depths, and --px/--py for a soft spotlight that follows the pointer.
 */
export default function CardFx() {
  useEffect(() => {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".card"));
    const move = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", ((x - 0.5) * 2).toFixed(3));
      card.style.setProperty("--my", ((y - 0.5) * 2).toFixed(3));
      card.style.setProperty("--px", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--py", `${(y * 100).toFixed(1)}%`);
    };
    const leave = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.setProperty("--mx", "0");
      card.style.setProperty("--my", "0");
    };
    cards.forEach((c) => { c.addEventListener("pointermove", move); c.addEventListener("pointerleave", leave); });
    return () => cards.forEach((c) => { c.removeEventListener("pointermove", move); c.removeEventListener("pointerleave", leave); });
  }, []);
  return null;
}
