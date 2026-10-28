"use client";

import { useEffect } from "react";
import { goTo } from "@/lib/scroll";

export function Rail() {
  return (
    <div className="rail" aria-hidden="true">
      <i id="railFill" />
      <svg id="railWedge"><use href="#wedge" /></svg>
    </div>
  );
}

export function Cursor() {
  useEffect(() => {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cur = document.getElementById("cur")!, ring = document.getElementById("curRing")!;
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
    document.documentElement.classList.add("has-cur");
    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; cur.style.transform = `translate(${mx}px,${my}px)`; };
    const over = (e: PointerEvent) => ring.classList.toggle("big", !!(e.target as Element).closest("a,button,.card,.logo-tile,.slot,.day"));
    const loop = () => { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; ring.style.transform = `translate(${rx}px,${ry}px)`; raf = requestAnimationFrame(loop); };
    addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", move); document.removeEventListener("pointerover", over); document.documentElement.classList.remove("has-cur"); };
  }, []);
  return (<><div className="cur" id="cur" /><div className="cur-ring" id="curRing" /></>);
}

export function Nav() {
  const go = (sel: string) => (e: React.MouseEvent) => { e.preventDefault(); goTo(sel); };
  return (
    <nav className="nav" aria-label="Main">
      <button className="mark" onClick={go("#intro")} aria-label="Wacko Studios, back to top" />
      <ul>
        <li><a href="#services" onClick={go("#services")}>Services</a></li>
        <li><a href="#work" onClick={go("#work")}>Work</a></li>
        <li><a href="#clients" onClick={go("#clients")}>Clients</a></li>
        <li><a href="#contact" onClick={go("#contact")}>Contact</a></li>
      </ul>
      <a className="btn sm" href="#book" onClick={go("#book")}>Book a call</a>
    </nav>
  );
}

export function GoLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  return <a className={className} href={to} onClick={(e) => { e.preventDefault(); goTo(to); }}>{children}</a>;
}
