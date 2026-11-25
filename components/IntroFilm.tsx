"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The opening film: our Wacko monogram video plays full screen (a horizontal one on wide screens, a vertical one on phones), with sound
 * where the browser allows it, then fades away to reveal the page, which finishes loading underneath.
 *
 * A tiny script in <head> (app/layout.tsx) puts `film-on` on <html> before the first paint, so there is no flash of the old loader.
 * It does that once per browser session, on the home page only, never for reduced-motion visitors, and never with a #hash link.
 * Add ?film=1 to the address to force it, ?film=0 to skip it.
 *
 * Browsers refuse sound that starts without a tap. We try with sound first; if refused, the film plays silently with a "Tap for sound"
 * pill, and a tap anywhere switches the sound on without restarting.
 */
const TALL = "/intro/wacko-intro-tall.mp4";
const WIDE = "/intro/wacko-intro-wide.mp4";
const WIDE_SCREEN = "(min-aspect-ratio: 5/4)";
const KEY = "wk-film";

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
      try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode: it just plays again next visit */ }
      v.pause();
      html.classList.remove("film-on");
      dispatchEvent(new Event("film:done"));
    };
    const fade = (ms = 950) => { b.classList.add("out"); timers.push(window.setTimeout(finish, ms)); };

    const onEnd = () => { if (!fading) { fading = true; fade(); } };
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

    return () => { finished = true; timers.forEach(clearTimeout); v.removeEventListener("ended", onEnd); v.removeEventListener("error", finish); };
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
