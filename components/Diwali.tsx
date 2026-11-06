"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Diya, Phuljhari, SutliBomb } from "./DiwaliIcons";
import { DIWALI } from "@/lib/diwali";

type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number; max: number; w: number; c: string; g: number; drag: number };
const WARM = ["#fff6d5", "#ffd166", "#ffb627", "#ff7a1a"];
const FIRE = ["#fff1b8", "#ffc531", "#ff8a1f", "#ff4d14", "#d92b0b"];
const pick = <T,>(a: readonly T[]) => a[(Math.random() * a.length) | 0];
const noop = () => () => {};

/** Transparent video works in Chromium and Firefox; Safari and every iPhone browser show it with a black box, so they get the boxed clip. */
const canCutout = () => typeof document !== "undefined" && typeof navigator !== "undefined" && !/iPad|iPhone|iPod/.test(navigator.userAgent) && !/^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent) && !!document.createElement("video").canPlayType('video/webm; codecs="vp9"');

// Where things sit inside their own artwork (viewBox 120 or 160), as a fraction of the icon's size.
const FLAME = { x: 97 / 120, y: 32 / 120 };
const FUSE = { x: 86 / 120, y: 10 / 120 };
const TRAIL_MS = 1000; // how long the glowing path behind the sparkler lasts
// The sparkler is drawn mirrored left to right (see .dw-pj svg in globals.css), so its burning tip is mirrored too.
const FUSE_END = { x: 86, y: 10 }; // the fuse tip in the bomb artwork (viewBox 120)
const TIP = { x: 1 - 104 / 160, y: 56 / 160 };

/**
 * The Diwali playground on the landing screen. The diyas replace the floating asterisks and burn from the start. The sparkler
 * starts unlit: hold it in a diya's flame until it catches, then touch the sutli bomb's fuse with it to set the bomb off. The bomb blasts across the whole
 * screen, the "Happy Diwali" clip plays, and then everything resets so it can be played again.
 *
 * Sparks are drawn on one fixed canvas that fades slowly instead of clearing, so a moving sparkler leaves a glowing trail
 * for a couple of seconds (a slow-shutter photo). The canvas and overlays live in <body> so the pinned stage can't clip them.
 */
export default function Diwali() {
  const host = useSyncExternalStore(noop, () => document.body, () => null);
  const [bomb, setBomb] = useState<"idle" | "fuse" | "gone">("idle");
  const [blast, setBlast] = useState(0);
  const [meme, setMeme] = useState(false);
  const [noVideo, setNoVideo] = useState(false);
  const [cutOk, setCutOk] = useState(true); // false once the transparent clip failed to load
  const [needSound, setNeedSound] = useState(false);
  const [step, setStep] = useState(0); // 0 sparkler unlit, 1 sparkler burning, 2 bomb lit
  const [drag, setDrag] = useState(false);

  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const pj = useRef<HTMLDivElement>(null);
  const bombEl = useRef<HTMLDivElement>(null);
  const diyaEls = useRef<(HTMLDivElement | null)[]>([]);
  const memeTimer = useRef(0);
  const act = useRef<{ reset: () => void } | null>(null);
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const cv = canvas.current, sparkler = pj.current, bombBox = bombEl.current, board = root.current;
    if (!cv || !sparkler || !bombBox || !board) return;
    const ctx = cv.getContext("2d");
    const stage = document.getElementById("stage");
    if (!ctx || !stage) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = 1, w = 0, h = 0, raf = 0, last = 0, visible = true;
    let phase: "play" | "fuse" | "blast" | "meme" = "play";
    let tip = { x: -1, y: -1 };
    let fuseDwell = 0, fuseStart = 0, ignite = 0, burning = false;
    const fuseLine = bombBox.querySelector<SVGPathElement>(".fuse");
    const fuseSpark = bombBox.querySelector<SVGGElement>(".s-spark");
    const fuseLen = fuseLine?.getTotalLength() ?? 0;
    const pos = { x: 0, y: 0 };
    const sparks: Spark[] = [];
    const trail: { x: number; y: number; t: number }[] = [];
    const timers: number[] = [];

    // Phones only allow sound that starts from a touch. So the first touch on the sparkler quietly starts (and pauses) the clip and wakes
    // the audio engine; when the blast comes the same video element and audio engine are already allowed to make noise.
    let ac: AudioContext | null = null, unlocked = false;
    const unlock = () => {
      try {
        if (!ac) { const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; if (AC) ac = new AC(); }
        ac?.resume().catch(() => {});
        loadBang();
      } catch { /* no audio, fine */ }
      const v = vidRef.current;
      if (v && !unlocked) {
        unlocked = true; v.muted = true;
        v.play().then(() => { if (phase !== "meme") { v.pause(); v.currentTime = 0; } }).catch(() => { unlocked = false; });
      }
    };

    // The bomb's bang is a real recording. It is fetched and decoded on the first touch so it can fire the instant the bomb goes off.
    let bang: AudioBuffer | null = null;
    const loadBang = () => {
      if (!ac || bang) return;
      fetch(DIWALI.blastSound).then((r) => r.arrayBuffer()).then((b) => ac!.decodeAudioData(b)).then((buf) => { bang = buf; }).catch(() => {});
    };
    const blastSound = () => {
      if (!ac || !bang || ac.state === "closed") return;
      const src = ac.createBufferSource(), g = ac.createGain();
      src.buffer = bang; g.gain.value = 1; src.connect(g); g.connect(ac.destination); src.start();
    };

    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      w = innerWidth; h = innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    };

    const burst = (x: number, y: number, n: number, speed: number, set: readonly string[], life = 0.9, g = 260) => {
      if (reduced) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.2832, s = speed * (0.25 + Math.random() * 0.75);
        sparks.push({ x, y, px: x, py: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: life * (0.5 + Math.random() * 0.7), w: 1 + Math.random() * 1.6, c: pick(set), g, drag: 0.4 });
      }
    };

    const reset = () => {
      timers.forEach(clearTimeout); timers.length = 0;
      clearTimeout(memeTimer.current);
      phase = "play"; fuseDwell = 0; sparks.length = 0; trail.length = 0;
      const v = vidRef.current; if (v) { v.pause(); v.currentTime = 0; v.muted = true; }
      ignite = 0; burning = false; sparkler.style.setProperty("--p", "0");
      fuseLine?.style.removeProperty("stroke-dashoffset"); fuseSpark?.style.removeProperty("transform");
      pos.x = 0; pos.y = 0; sparkler.style.transform = "";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      setStep(0); setBomb("idle"); setMeme(false); setBlast(0); setNeedSound(false); setCutOk(true);
    };
    act.current = { reset };

    const explode = () => {
      const r = bombBox.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      phase = "blast";
      setBomb("gone"); setBlast((b) => b + 1); blastSound();
      // A ball of fire from the bomb, then sparks raining over the whole screen.
      burst(cx, cy, reduced ? 0 : 520, 1500, FIRE, 1.5, 420);
      for (let i = 0; i < (reduced ? 0 : 8); i++) timers.push(window.setTimeout(() => burst(Math.random() * w, Math.random() * h * 0.8, 70, 520, FIRE, 1.1, 360), 160 + i * 120));
      timers.push(window.setTimeout(() => {
        phase = "meme"; setMeme(true);
        const v = vidRef.current;
        if (v) { v.currentTime = 0; v.muted = false; v.volume = 1; v.play().catch(() => { v.muted = true; setNeedSound(true); v.play().catch(() => {}); }); }
        memeTimer.current = window.setTimeout(reset, DIWALI.memeMaxMs); }, DIWALI.memeDelayMs));
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
      // The stage stays pinned while the intro plays, so carry the playground up with the scroll and drop it once it has left the screen.
      const sy = scrollY;
      board.style.transform = sy ? `translate3d(0,${-sy}px,0)` : "";
      board.style.visibility = sy > h ? "hidden" : "";
      if (!visible && phase === "play") {
        if (trail.length || sparks.length) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); trail.length = 0; sparks.length = 0; }
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round"; ctx.lineJoin = "round";

      const r = sparkler.getBoundingClientRect();
      const nx = r.left + r.width * TIP.x, ny = r.top + r.height * TIP.y;
      const moved = tip.x < 0 ? 0 : Math.hypot(nx - tip.x, ny - tip.y);
      const vx = tip.x < 0 ? 0 : (nx - tip.x) / dt, vy = tip.x < 0 ? 0 : (ny - tip.y) / dt;
      tip = { x: nx, y: ny };

      // The slow-shutter trail: where the burning tip has been, glowing and thinning until it is gone after TRAIL_MS.
      if (burning && !reduced && phase !== "meme" && moved > 0.5) trail.push({ x: nx, y: ny, t });
      while (trail.length && t - trail[0].t > TRAIL_MS) trail.shift();
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1], b = trail[i];
        if (Math.hypot(b.x - a.x, b.y - a.y) > 160) continue; // a jump (e.g. after a reset), not a stroke
        const k = 1 - (t - b.t) / TRAIL_MS;
        ctx.strokeStyle = `rgba(255,170,40,${(0.5 * k).toFixed(3)})`; ctx.lineWidth = 1.5 + 3.5 * k;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.strokeStyle = `rgba(255,246,213,${(0.95 * k).toFixed(3)})`; ctx.lineWidth = 0.6 + 1.1 * k;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      // a few sparks off the sparkler, carrying some of its movement
      if (burning && !reduced && phase !== "meme" && r.bottom > 0 && r.top < h) {
        const n = Math.round(70 * dt + Math.min(3, moved / 14) + Math.random());
        for (let i = 0; i < n; i++) {
          const a = Math.random() * 6.2832, s = 50 + Math.random() * 150;
          sparks.push({ x: nx, y: ny, px: nx, py: ny, vx: Math.cos(a) * s + vx * 0.2, vy: Math.sin(a) * s + vy * 0.2, life: 0, max: 0.11 + Math.random() * 0.2, w: 0.5 + Math.random() * 0.7, c: pick(WARM), g: 300, drag: 1.4 });
        }
      }

      // The fuse burns down towards the bomb: it shortens, the flame travels with its end, and a small sparkle shows it has caught.
      if (phase === "fuse" && fuseLine && fuseSpark) {
        const k = Math.min(1, (t - fuseStart) / DIWALI.fuseBurnMs) * 0.92;
        const pt = fuseLine.getPointAtLength(fuseLen * (1 - k));
        fuseLine.style.strokeDashoffset = String(k);
        fuseSpark.style.transform = `translate(${pt.x - FUSE_END.x}px,${pt.y - FUSE_END.y}px)`;
        if (!reduced) {
          const b = bombBox.getBoundingClientRect();
          const fx = b.left + b.width * (pt.x / 120), fy = b.top + b.height * (pt.y / 120);
          const n = Math.round(60 * dt + Math.random());
          for (let i = 0; i < n; i++) {
            const a = Math.random() * 6.2832, s = 40 + Math.random() * 110;
            sparks.push({ x: fx, y: fy, px: fx, py: fy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, life: 0, max: 0.15 + Math.random() * 0.3, w: 0.6 + Math.random() * 0.9, c: pick(WARM), g: 220, drag: 1.2 });
          }
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life += dt;
        if (p.life >= p.max) { sparks.splice(i, 1); continue; }
        p.px = p.x; p.py = p.y;
        p.vx *= Math.exp(-p.drag * dt); p.vy = p.vy * Math.exp(-p.drag * dt) + p.g * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.globalAlpha = 1 - p.life / p.max;
        ctx.strokeStyle = p.c; ctx.lineWidth = p.w;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (phase !== "play" && phase !== "fuse") return;

      // light the sparkler: hold its tip in a diya's flame
      if (!burning) {
        let near = false, fx = 0, fy = 0;
        for (const el of diyaEls.current) {
          if (!el) continue;
          const b = el.getBoundingClientRect();
          if (!b.width) continue; // hidden on this screen size
          fx = b.left + b.width * FLAME.x; fy = b.top + b.height * FLAME.y;
          if (Math.hypot(nx - fx, ny - fy) < Math.max(28, b.width * 0.3)) { near = true; break; }
        }
        ignite = near ? ignite + dt * 1000 : Math.max(0, ignite - dt * 1500);
        sparkler.style.setProperty("--p", Math.min(1, ignite / DIWALI.lightMs).toFixed(3));
        if (ignite >= DIWALI.lightMs) {
          burning = true; setStep(1);
          sparkler.style.setProperty("--p", "0");
          burst(nx, ny, 40, 240, WARM, 0.8, 300);
        }
        return;
      }

      // light the bomb: touch its fuse with the burning sparkler
      if (phase === "play") {
        const b = bombBox.getBoundingClientRect();
        const d = Math.hypot(nx - (b.left + b.width * FUSE.x), ny - (b.top + b.height * FUSE.y));
        fuseDwell = d < Math.max(26, b.width * 0.28) ? fuseDwell + dt * 1000 : Math.max(0, fuseDwell - dt * 1200);
        if (fuseDwell >= DIWALI.fuseTouchMs) {
          phase = "fuse"; fuseStart = t; setBomb("fuse"); setStep(2);
          timers.push(window.setTimeout(explode, DIWALI.fuseBurnMs));
        }
      }
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(stage);
    resize();
    addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    // dragging the sparkler (mouse or finger)
    let grab: { x: number; y: number; bx: number; by: number } | null = null;
    const down = (e: PointerEvent) => {
      if (phase === "meme" || phase === "blast") return;
      unlock();
      grab = { x: e.clientX, y: e.clientY, bx: pos.x, by: pos.y };
      sparkler.setPointerCapture(e.pointerId); setDrag(true);
    };
    const move = (e: PointerEvent) => {
      if (!grab) return;
      pos.x = grab.bx + e.clientX - grab.x; pos.y = grab.by + e.clientY - grab.y;
      sparkler.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
    };
    const up = () => { grab = null; setDrag(false); };
    sparkler.addEventListener("pointerdown", down);
    sparkler.addEventListener("pointermove", move);
    sparkler.addEventListener("pointerup", up);
    sparkler.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", resize);
      timers.forEach(clearTimeout); clearTimeout(memeTimer.current);
      sparkler.removeEventListener("pointerdown", down); sparkler.removeEventListener("pointermove", move);
      sparkler.removeEventListener("pointerup", up); sparkler.removeEventListener("pointercancel", up);
      act.current = null;
    };
  }, [host]);

  const endMeme = () => act.current?.reset();
  const useCut = !!host && cutOk && canCutout(); // browser only: the server has no document
  const cut = meme && useCut; // show the big transparent Jethalal instead of the boxed clip

  // Warm the cache as soon as the sparkler is lit, so the clip can start the moment the blast is over.
  useEffect(() => { if (step >= 1) fetch(canCutout() ? DIWALI.cutout : DIWALI.video).catch(() => {}); }, [step]);

  return (
    <>
      <div className="dw" ref={root} aria-hidden="true">
        {DIWALI.diyas.map((d, i) => (
          <div key={i} className={`dw-i${d.phone ? " dw-pos" : " dw-wide"}`} ref={(el) => { diyaEls.current[i] = el; }} style={{ left: `${d.left}%`, top: `${d.top}%`, "--w": `${d.w}px`, "--pl": d.phone ? `${d.phone.left}%` : undefined, "--pt": d.phone ? `${d.phone.top}%` : undefined } as CSSProperties}>
            <Diya size={d.w} />
          </div>
        ))}
        <div className={`dw-i dw-bomb${bomb === "gone" ? " gone" : ""}`} ref={bombEl}>
          <SutliBomb lit={bomb === "fuse"} size={110} />
        </div>
        <div className={`dw-pj${drag ? " on" : ""}`} ref={pj}>
          <Phuljhari lit={step >= 1} size={200} />
          {step < 2 && <span className="dw-hint">{step === 0 ? "Hold me in a diya's flame" : "Now touch the bomb's fuse"}</span>}
        </div>
      </div>
      {host && createPortal(
        <>
          <canvas className="dw-fx" ref={canvas} aria-hidden="true" />
          {blast > 0 && <div className="dw-flash" key={blast} aria-hidden="true" />}
          <div className={`dw-meme${cut ? " cut" : ""}`} style={meme ? undefined : { display: "none" }} role="status" aria-label="Happy Diwali" onClick={endMeme}>
            {noVideo && (
              <div className="dw-card">
                <div className="dw-card-diyas"><Diya size={84} /><Diya size={110} /><Diya size={84} /></div>
                <b>Happy Diwali!</b>
                <span>from all of us at Wacko Studios</span>
              </div>
            )}
            <video
              ref={vidRef} className={`dw-video${cut ? " cut" : ""}`} style={noVideo ? { display: "none" } : undefined} src={useCut ? DIWALI.cutout : DIWALI.video} playsInline preload={step >= 1 ? "auto" : "none"} onEnded={endMeme}
              onError={() => { if (useCut) { setCutOk(false); return; } setNoVideo(true); clearTimeout(memeTimer.current); memeTimer.current = window.setTimeout(endMeme, DIWALI.memeMs); }}
            />
            {needSound && !noVideo && (
              <button type="button" className="dw-sound" onClick={(e) => { e.stopPropagation(); const v = vidRef.current; if (v) { v.muted = false; v.currentTime = 0; v.play().catch(() => {}); } setNeedSound(false); }}>
                Tap for sound
              </button>
            )}
          </div>
        </>,
        host,
      )}
    </>
  );
}
