"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The opening film: our "wacko-eye" intro plays full screen, with sound where the browser allows it, and its last scene (the logo on
 * navy) slides onto the logo of the loading screen underneath and fades away, so the film hands over to the page.
 *
 * A tiny script in <head> (app/layout.tsx) puts `film-on` on <html> before the first paint, so there is no flash of the old loader.
 * It does that once per browser session, on the home page only, never for reduced-motion visitors, and never with a #hash link.
 * Add ?film=1 to the address to force it, ?film=0 to skip it.
 *
 * Browsers refuse sound that starts without a tap. We try with sound first; if refused, the film plays silently with a "Tap for sound"
 * pill, and a tap anywhere switches the sound on without restarting.
 */
const SRC = "/intro/wacko-intro.mp4";
const VW = 1920, VH = 1080;                 // video size in pixels
const LOCK = { cx: 960, cy: 479, w: 557 }; // the logo and its name in the last scene, in video pixels
const SLIDE_AT = 9.5;                      // seconds: the logo has settled, start moving it onto the page's logo
const FADE_AT = 10.1;                      // seconds: start fading the film out
// The loading logo's visible size and centre compared with its layout box (#logoWrap), measured from the live page.
const SITE = { w: 1.0736, dx: 6 / 299, dy: -3 / 299 };
const KEY = "wk-film";

export default function IntroFilm() {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const skipFn = useRef<() => void>(() => {});
  const [needSound, setNeedSound] = useState(false);

  useEffect(() => {
    const html = document.documentElement, b = box.current, v = vid.current;
    if (!b || !v || !html.classList.contains("film-on")) return;
    let finished = false, phase = 0;
    const timers: number[] = [];

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode: it just plays again next visit */ }
      v.pause();
      html.classList.remove("film-on");
      dispatchEvent(new Event("film:done"));
    };
    const fade = (ms = 950) => { b.classList.add("out"); timers.push(window.setTimeout(finish, ms)); };

    // Slide and scale the last scene so its logo lands exactly on the loading screen's logo.
    const slide = () => {
      const wrap = document.getElementById("logoWrap")?.getBoundingClientRect();
      if (!wrap || !wrap.width) return;
      const W = b.clientWidth, H = b.clientHeight;
      const s0 = getComputedStyle(v).objectFit === "contain" ? Math.min(W / VW, H / VH) : Math.max(W / VW, H / VH);
      const tw = wrap.width * SITE.w;
      const tcx = wrap.x + wrap.width / 2 + wrap.width * SITE.dx, tcy = wrap.y + wrap.height / 2 + wrap.width * SITE.dy;
      const k = tw / (LOCK.w * s0);
      v.style.transform = `translate(${tcx - W / 2}px, ${tcy - H / 2 + (VH / 2 - LOCK.cy) * s0 * k}px) scale(${k})`;
      b.classList.add("go");
    };

    const onTime = () => {
      const t = v.currentTime;
      if (phase < 1 && t >= SLIDE_AT) { phase = 1; slide(); }
      if (phase < 2 && t >= FADE_AT) { phase = 2; fade(); }
    };
    const onEnd = () => { if (phase < 2) { phase = 2; fade(); } };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    v.addEventListener("error", finish);

    // Skip: fade the sound and the picture out quickly.
    skipFn.current = () => {
      if (phase >= 2) return;
      phase = 2;
      let vol = v.volume;
      const iv = window.setInterval(() => { vol = Math.max(0, vol - 0.2); v.volume = vol; if (!vol) clearInterval(iv); }, 60);
      timers.push(iv);
      b.classList.add("quick");
      fade(450);
    };

    const begin = async () => {
      v.volume = 1; v.muted = false;
      try { await v.play(); }
      catch {
        v.muted = true;
        try { await v.play(); setNeedSound(true); } catch { finish(); }
      }
    };
    void begin();

    // If the film has not started after a few seconds (slow network, blocked video) the page must not be held up.
    timers.push(window.setTimeout(() => { if (v.currentTime < 0.1) finish(); }, 6000));
    timers.push(window.setTimeout(finish, 16000));

    return () => { finished = true; timers.forEach(clearTimeout); v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnd); v.removeEventListener("error", finish); };
  }, []);

  const unmute = () => { const v = vid.current; if (v && v.muted) { v.muted = false; v.volume = 1; setNeedSound(false); } };

  return (
    <div className="film" ref={box} onPointerDown={unmute} aria-hidden="true">
      <video ref={vid} src={SRC} playsInline preload="auto" />
      {needSound && <button type="button" className="film-btn film-sound" onClick={unmute}>Tap for sound</button>}
      <button type="button" className="film-btn film-skip" onPointerDown={(e) => e.stopPropagation()} onClick={() => skipFn.current()}>Skip</button>
    </div>
  );
}
