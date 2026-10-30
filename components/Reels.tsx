"use client";

import { useRef, useState } from "react";
import { REELS } from "@/lib/reels";
import Split from "./Split";

export default function Reels() {
  const track = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);

  const toggle = (i: number) => {
    const v = videos.current[i];
    if (!v) return;
    if (v.paused) {
      videos.current.forEach((o, k) => { if (o && k !== i) o.pause(); }); // one reel at a time
      v.play().catch(() => {});
    } else v.pause();
  };

  const scroll = (dir: 1 | -1) => {
    const t = track.current;
    if (t) t.scrollBy({ left: dir * Math.max(260, t.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <section className="reels" id="reels" aria-label="Our reels">
      <div className="in">
        <div className="reels-head">
          <div>
            <p className="eyebrow">Reels we made</p>
            <Split parts={["Thumbs ", { em: "stopped." }]} />
          </div>
          <div className="reels-nav rv" aria-label="Scroll reels">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous reels"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg></button>
            <button type="button" onClick={() => scroll(1)} aria-label="Next reels"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
      </div>
      <div className="reels-track" ref={track} tabIndex={0} aria-label="Reels, scroll sideways">
        {REELS.map((r, i) => (
          <figure className="reel rv" key={r.file} style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}>
            <div className={`reel-frame${playing === i ? " on" : ""}`}>
              <video
                ref={(el) => { videos.current[i] = el; }}
                src={`/reels/${r.file}.mp4`}
                poster={`/reels/${r.file}.jpg`}
                preload="none"
                playsInline
                loop
                onPlay={() => setPlaying(i)}
                onPause={() => setPlaying((p) => (p === i ? null : p))}
                onClick={() => toggle(i)}
              />
              <button type="button" className="reel-play" onClick={() => toggle(i)} aria-label={`${playing === i ? "Pause" : "Play"} reel ${i + 1}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{playing === i ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5l11 7-11 7z" />}</svg>
              </button>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
