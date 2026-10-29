"use client";

import { useEffect } from "react";
import { SERVICES } from "@/lib/data";
import { LOGO_W, WEDGE, sectorPath } from "@/lib/wedge";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const SL = [[-70, -48, -26], [-34, 56, 20], [12, -66, -14], [44, 60, 24], [74, -40, 32], [0, 78, -6]];

type Marquee = { track: HTMLElement; dir: number; speed: number; x: number | undefined; L: number };

/**
 * Drives every scroll-linked effect from a single rAF loop: the intro logo breaking apart and flooding orange,
 * the pinned horizontal services reel, stacking work cards, velocity-reactive marquees, the progress rail and
 * reveal-on-view. It writes styles straight to elements, so the components it touches must not set those styles.
 */
export default function ScrollEngine() {
  useEffect(() => {
    const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!;
    const $$ = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));
    const root = document.documentElement;
    const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (RM) root.classList.add("rm");

    let vw = innerWidth, vh = innerHeight, lastY = scrollY, vel = 0, svMax = 0, activeCard = -1, raf = 0;

    const intro = $("#intro"), stage = $("#stage"), logoWrap = $("#logoWrap"), apex = $("#apex"), flood = $("#flood");
    const wedge = document.getElementById("logoWedge") as unknown as SVGSVGElement, wedgePath = document.getElementById("wedgePath")!;
    const tagline = $("#tagline"), cue = $("#cue");
    const slices = $$(".slice"), fws = $$(".fw"), mWords = $$("#manifesto .mw");
    const sv = $("#services"), svStick = $("#svStick"), svRow = $("#svRow"), cards = $$(".card"), ghost = $("#ghost");
    const svBar = $("#svBar"), svCount = $("#svCount"), svName = $("#svName");
    const railFill = $("#railFill"), railWedge = $("#railWedge"), bigWedge = $("#bigWedge");
    const wks = $$(".wk");
    const mqs: Marquee[] = $$("[data-mq]").map((track) => ({ track, dir: +(track.dataset.dir ?? -1) || -1, speed: +(track.dataset.speed ?? 0.6) || 0.6, x: undefined, L: 1 }));

    const measure = () => {
      vw = innerWidth; vh = innerHeight;
      if (!RM) { svMax = Math.max(0, svRow.offsetWidth - vw); sv.style.height = svStick.offsetHeight + svMax + "px"; }
      mqs.forEach((m) => { m.L = m.track.scrollWidth / 4; if (m.x === undefined) m.x = m.dir < 0 ? 0 : -m.L; });
    };

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } }),
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    $$(".rv,[data-split],.wk").forEach((el) => io.observe(el));

    const frame = () => {
      const sy = scrollY;
      vel += (sy - lastY - vel) * 0.18; lastY = sy;
      const doc = root.scrollHeight - vh;
      const pg = doc > 0 ? clamp(sy / doc) : 0;
      railFill.style.transform = `scaleY(${pg})`;
      railWedge.style.top = pg * 100 + "%";

      if (!RM) {
        /* intro */
        const ir = intro.getBoundingClientRect();
        if (ir.bottom > -50 && ir.top < vh) {
          const p = clamp(-ir.top / (ir.height - stage.offsetHeight));
          const t1 = eio(clamp((p - 0.1) / 0.34));
          const sc = 1 + 0.55 * t1;
          logoWrap.style.transform = `scale(${sc})`;
          // The tagline and cue fade in with a CSS animation that holds its end state, so release it once scrolling starts.
          const anim = p > 0.005 ? "none" : "";
          slices.forEach((s, i) => {
            const v = SL[i], k = Math.min(vw, 1200) * 0.0105;
            s.style.transform = `translate(${v[0] * k * t1}px,${v[1] * k * t1 * 0.8}px) rotate(${v[2] * t1}deg)`;
            s.style.opacity = String(1 - clamp((t1 - 0.45) / 0.55));
          });
          const fade = String(1 - clamp(p / 0.08));
          tagline.style.opacity = fade; cue.style.opacity = fade;
          tagline.style.animation = cue.style.animation = anim;

          /* Wedge: zooms in towards the centre, opens up into a full circle, then that circle becomes the flood. */
          const ap = apex.getBoundingClientRect();
          const u = (logoWrap.offsetWidth / LOGO_W) * sc;          // screen px per logo unit
          const zoom = eio(clamp((p - 0.12) / 0.18));
          const open = eio(clamp((p - 0.26) / 0.14));
          const rEnd = Math.min(vw, vh) * 0.2;                      // radius of the circle at hand-off
          const k = lerp(WEDGE.r * u, rEnd, zoom) / (WEDGE.r * u);
          wedge.style.transform = `translate(${((vw / 2 - ap.left) * zoom) / sc}px,${((vh / 2 - ap.top) * zoom) / sc}px) scale(${k})`;
          wedgePath.setAttribute("d", sectorPath(lerp(WEDGE.half, 180, open)));

          const t2 = eio(clamp((p - 0.4) / 0.24));
          const maxR = Math.hypot(vw / 2, vh / 2) + 80;
          const rad = p < 0.4 ? 0 : lerp(rEnd, maxR, t2);
          flood.style.clipPath = `circle(${rad}px at ${vw / 2}px ${vh / 2}px)`;
          const q = clamp((p - 0.62) / 0.3), n = mWords.length;
          mWords.forEach((w, i) => { w.style.opacity = (0.16 + 0.84 * clamp(q * (n + 3) - i)).toFixed(3); });
          fws.forEach((f) => { f.style.transform = `translate3d(0,${-p * (+(f.dataset.sp ?? 80) || 80) * 3}px,0)`; });
        }

        /* services reel */
        const sr = sv.getBoundingClientRect();
        if (sr.bottom > -50 && sr.top < vh + 50) {
          const p = svMax ? clamp(-sr.top / svMax) : 0;
          svRow.style.transform = `translate3d(${-p * svMax}px,0,0)`;
          svBar.style.transform = `scaleX(${p})`;
          let best = -1, bd = 1e9;
          cards.forEach((c, i) => {
            const r = c.getBoundingClientRect(), d = (r.left + r.width / 2 - vw / 2) / vw, ad = Math.abs(d);
            c.style.transform = `rotate(${(d * -5).toFixed(2)}deg) scale(${(1 - Math.min(0.09, ad * 0.09)).toFixed(3)})`;
            if (ad < bd) { bd = ad; best = i; }
          });
          if (bd > 0.34) best = -1;
          if (best !== activeCard) {
            activeCard = best;
            cards.forEach((c, i) => c.classList.toggle("on", i === best));
            const nm = best >= 0 ? cards[best].dataset.name! : "Services";
            ghost.textContent = nm; svName.textContent = nm;
            svCount.textContent = String(best + 1).padStart(2, "0") + " / " + SERVICES.length;
            ghost.classList.remove("pop"); void ghost.offsetWidth; ghost.classList.add("pop");
          }
        }

        /* work stack */
        wks.forEach((c, i) => {
          const nx = wks[i + 1];
          if (!nx) { c.style.transform = ""; return; }
          const a = c.getBoundingClientRect().top, b = nx.getBoundingClientRect().top;
          const t = clamp(1 - (b - a - 16) / (c.offsetHeight * 0.95));
          c.style.setProperty("--t", t.toFixed(3));
          c.style.transform = `scale(${1 - 0.05 * t})`;
        });

        /* marquees */
        mqs.forEach((m) => {
          const step = m.speed + Math.min(Math.abs(vel), 70) * 0.14;
          m.x = (m.x ?? 0) + m.dir * step;
          if (m.dir < 0 && m.x <= -m.L) m.x += m.L;
          if (m.dir > 0 && m.x >= 0) m.x -= m.L;
          m.track.style.transform = `translate3d(${m.x}px,0,0)`;
        });

        /* closing wedge */
        const cr = bigWedge.parentElement!.getBoundingClientRect();
        if (cr.bottom > 0 && cr.top < vh) {
          const cp = clamp(-cr.top / cr.height);
          bigWedge.style.transform = `translate3d(0,${cp * 160}px,0) rotate(${-14 + cp * 70}deg)`;
        }
      }
      raf = requestAnimationFrame(frame);
    };

    addEventListener("resize", measure);
    addEventListener("load", measure);
    document.fonts?.ready.then(measure);
    measure();
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      removeEventListener("resize", measure); removeEventListener("load", measure);
      root.classList.remove("rm");
    };
  }, []);

  return null;
}
