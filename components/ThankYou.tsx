"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { calendarUrl } from "@/lib/bookingEmail";
import { PHONE, WA } from "@/lib/data";

type Saved = { name: string; label: string; topic: string; date: string; time: string };

const subscribe = () => () => {};
// The scheduler leaves the details in sessionStorage (never in the URL). A direct visit simply has none.
const read = () => { try { return sessionStorage.getItem("ws:booking"); } catch { return null; } };

const STEPS = [
  "The team reads your request.",
  "We reply to confirm the slot, usually within one working day.",
  "We talk for 30 minutes and agree a clear next step.",
];

export default function ThankYou() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const saved = useMemo<Saved | null>(() => { try { return raw ? (JSON.parse(raw) as Saved) : null; } catch { return null; } }, [raw]);
  const first = saved?.name.trim().split(/\s+/)[0];
  const cal = saved ? calendarUrl(saved, "Intro call with Wacko Studios") : null;

  return (
    <main className="ty">
      <svg className="bw" viewBox="0 0 128 120" aria-hidden="true"><path fill="currentColor" d="M52.6 2.0L30.4 11.7L40.2 36.3L17.3 26.8L15.2 26.5L6.1 49.4L29.5 59.3L30.4 60.3L7.6 69.8L5.9 71.2L15.4 93.6L40.3 83.8L30.5 108.6L53.3 117.9L64.1 93.5L73.8 116.9L75.2 117.9L97.4 108.5L88.0 85.2L87.9 83.7L111.9 93.6L112.8 93.4L121.9 70.7L97.6 60.1L121.2 50.0L121.9 48.8L112.5 26.3L88.6 36.2L87.7 36.1L97.4 12.0L97.2 11.2L74.5 2.0L64.0 26.4L53.9 2.7Z" /></svg>
      <svg className="bw bw2" viewBox="0 0 128 120" aria-hidden="true"><path fill="currentColor" d="M52.6 2.0L30.4 11.7L40.2 36.3L17.3 26.8L15.2 26.5L6.1 49.4L29.5 59.3L30.4 60.3L7.6 69.8L5.9 71.2L15.4 93.6L40.3 83.8L30.5 108.6L53.3 117.9L64.1 93.5L73.8 116.9L75.2 117.9L97.4 108.5L88.0 85.2L87.9 83.7L111.9 93.6L112.8 93.4L121.9 70.7L97.6 60.1L121.2 50.0L121.9 48.8L112.5 26.3L88.6 36.2L87.7 36.1L97.4 12.0L97.2 11.2L74.5 2.0L64.0 26.4L53.9 2.7Z" /></svg>
      <div className="in ty-in">
        <Link className="ty-logo" href="/" aria-label="Wacko Studios, back to the home page" />
        <p className="eyebrow">Request sent</p>
        <h1>Thank you{first ? <>, <em>{first}</em></> : null}.</h1>
        <p className="lead">Your meeting request is with the team. Keep an eye on your email or WhatsApp, we will be in touch to confirm.</p>

        {saved && (
          <dl className="ty-card">
            <dt>Slot</dt><dd>{saved.label}</dd>
            <dt>Topic</dt><dd>{saved.topic}</dd>
          </dl>
        )}

        <ol className="ty-steps">{STEPS.map((t) => <li key={t}>{t}</li>)}</ol>

        <div className="ty-act">
          {cal && <a className="btn" href={cal} target="_blank" rel="noopener">Add to calendar</a>}
          <a className="btn ghost" href={`https://wa.me/${WA}`} target="_blank" rel="noopener">Message us on WhatsApp</a>
          <Link className="btn ghost" href="/">Back to home</Link>
        </div>
        <p className="ty-note">Prefer to talk now? Call {PHONE}.</p>
      </div>
    </main>
  );
}
