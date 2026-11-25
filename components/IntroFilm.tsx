"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The opening film: our Wacko monogram video plays full screen (a horizontal one on wide screens, a vertical one on phones), with sound
 * where the browser allows it. Both videos show a flat orange W on off-white at 4.7 s, so we stop there, lay the page logo's own W exactly
 * on top of it, fade the film away and let that W glide to its place while the rest of the logo appears.
 *
 * A tiny script in <head> (app/layout.tsx) puts `film-on` on <html> before the first paint, so there is no flash of the old loader.
 * It does that on every load or refresh of the home page (nothing is remembered), but never for reduced-motion visitors and never with a
 * #hash link. Add ?film=0 to the address to skip it.
 *
 * Browsers refuse sound that starts without a tap. We try with sound first; if refused, the film plays silently with a "Tap for sound"
 * pill, and a tap anywhere switches the sound on without restarting.
 */
const TALL = "/intro/wacko-intro-tall.mp4";
const WIDE = "/intro/wacko-intro-wide.mp4";
const WIDE_SCREEN = "(min-aspect-ratio: 5/4)";
const HOLD_AT = 4.7; // seconds: the frame with the orange W (it lasts from 4.64 to 4.76)
// That W in both videos: dead centre, this wide in video pixels.
const FILM_W = 190;
const SIZE = { wide: { w: 1920, h: 1080 }, tall: { w: 1080, h: 1920 } };

export default function IntroFilm() {
  const box = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const skipFn = useRef<() => void>(() => {});
  const [needSound, setNeedSound] = useState(false);

  useEffect(() => {
    const html = document.documentElement, b = box.current, v = vid.current;
    if (!b || !v || !html.classList.contains("film-on")) return;
    let finished = false, fading = false;
    const timers: number[] = [];
    // Picked here, not in the markup, so only the video this screen needs is downloaded (and none when the film is off).
    const wide = matchMedia(WIDE_SCREEN).matches;
    v.classList.toggle("wide", wide);
    v.src = wide ? WIDE : TALL;

    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      v.pause();
      html.classList.remove("film-on");
      dispatchEvent(new Event("film:done"));
    };
    const showLogo = () => html.classList.add("film-landed"); // brings in the asterisk and the name
    const fade = (ms = 950) => { showLogo(); b.classList.add("out"); timers.push(window.setTimeout(finish, ms)); };

    let undoMark = () => {};
    const land = () => {
      if (fading || finished) return;
      fading = true;
      v.pause();
      if (Math.abs(v.currentTime - HOLD_AT) > 0.05) v.currentTime = HOLD_AT;
      const mark = document.querySelector<HTMLElement>('#logoWrap .slice[data-row="mark"]');
      if (!mark || !mark.offsetWidth) return fade();
      // Where the W is on screen. The video is object-fit: cover, so its W is at the centre of the video element.
      const box = v.getBoundingClientRect(), size = wide ? SIZE.wide : SIZE.tall;
      const width = FILM_W * Math.max(box.width / size.w, box.height / size.h);
      const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
      const origin = mark.style.transformOrigin;
      undoMark = () => Object.assign(mark.style, { transition: "", translate: "", scale: "", transformOrigin: origin });
      // Move the page's own W there. It sits inside scaled and 3D parents, so measure and correct a few times.
      let x = 0, y = 0, k = 1;
      Object.assign(mark.style, { transition: "none", transformOrigin: "50% 50%" });
      for (let i = 0; i < 4; i++) {
        mark.style.translate = `${x}px ${y}px`; mark.style.scale = `${k}`;
        const r = mark.getBoundingClientRect(), parentScale = r.width / (mark.offsetWidth * k);
        x += (cx - (r.x + r.width / 2)) / parentScale;
        y += (cy - (r.y + r.height / 2)) / parentScale;
        k *= width / r.width;
      }
      mark.style.translate = `${x}px ${y}px`; mark.style.scale = `${k}`;
      timers.push(window.setTimeout(() => b.classList.add("out", "land"), 180));   // the film melts away over its twin
      timers.push(window.setTimeout(() => {                                      // then the W travels home
        mark.style.transition = "translate .9s cubic-bezier(.65,0,.35,1), scale .9s cubic-bezier(.65,0,.35,1)";
        mark.style.translate = ""; mark.style.scale = "";
        showLogo();
      }, 560));
      timers.push(window.setTimeout(() => { undoMark(); finish(); }, 1520));
    };

    // Watch every screen frame: timeupdate is too coarse to stop on a picture that lasts a tenth of a second.
    let raf = 0;
    const watch = () => {
      if (fading || finished) return;
      const t = v.currentTime;
      if (t > HOLD_AT - 0.4) v.volume = Math.max(0, Math.min(1, (HOLD_AT - t) / 0.4)); // no abrupt cut in the sound
      if (t >= HOLD_AT - 0.03) land();
      else raf = requestAnimationFrame(watch);
    };
    raf = requestAnimationFrame(watch);
    const onEnd = () => land(); // e.g. the tab was in the background, so no frames were watched
    v.addEventListener("ended", onEnd);
    v.addEventListener("error", finish);

    // Skip: fade the sound and the picture out quickly.
    skipFn.current = () => {
      if (fading) return;
      fading = true;
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

    return () => { finished = true; cancelAnimationFrame(raf); undoMark(); timers.forEach(clearTimeout); v.removeEventListener("ended", onEnd); v.removeEventListener("error", finish); };
  }, []);

  const unmute = () => { const v = vid.current; if (v && v.muted) { v.muted = false; v.volume = 1; setNeedSound(false); } };

  return (
    <div className="film" ref={box} onPointerDown={unmute} aria-hidden="true">
      <video ref={vid} playsInline preload="auto" />
      {needSound && <button type="button" className="film-btn film-sound" onClick={unmute}>Tap for sound</button>}
      <button type="button" className="film-btn film-skip" onPointerDown={(e) => e.stopPropagation()} onClick={() => skipFn.current()}>Skip</button>
    </div>
  );
}
