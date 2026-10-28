"use client";

import { useState, useSyncExternalStore } from "react";
import { EMAIL, SERVICES, TIMES, WA } from "@/lib/data";
import { copyText } from "@/lib/copy";
import Split from "./Split";

const DN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The next 12 bookable days (Sundays skipped). Built on the client only, so server and client markup match.
const NO_DAYS: Date[] = [];
let clientDays: Date[] | null = null;
const getDays = () => {
  if (!clientDays) {
    clientDays = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    while (clientDays.length < 12) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) clientDays.push(new Date(d)); }
  }
  return clientDays;
};
const subscribe = () => () => {};

export default function Book() {
  const days = useSyncExternalStore(subscribe, getDays, () => NO_DAYS);
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy details");
  const [form, setForm] = useState({ name: "", contact: "", topic: "Not sure yet", notes: "" });

  const dTxt = (d: Date) => `${DN[d.getDay()]} ${d.getDate()} ${MN[d.getMonth()]}`;
  const label = day !== null && time !== null ? `${dTxt(days[day])}, ${TIMES[time]} IST` : null;

  const pick =
    label ? <>Selected: <span>{label}</span> · 30 min</>
    : day !== null ? <>Day: <span>{dTxt(days[day])}</span>. Now choose a time.</>
    : time !== null ? <>Time: <span>{TIMES[time]} IST</span>. Now choose a day.</>
    : "Nothing selected yet.";

  const message = () =>
    `Hi Wacko Studios! I would like to book a 30 minute meeting.\nWhen: ${label}\nName: ${form.name.trim()}\nContact: ${form.contact.trim()}\nTopic: ${form.topic}` +
    (form.notes.trim() ? `\nNotes: ${form.notes.trim()}` : "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label === null) return setErr("Please choose a day and a time first.");
    if (!form.name.trim() || !form.contact.trim()) return setErr("Please add your name and an email or phone number.");
    setErr("");
    setMsg(message());
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  const clearErr = () => setErr("");

  return (
    <section className="book" id="book" aria-label="Schedule a meeting">
      <div className="in book-grid">
        <div>
          <p className="eyebrow">Free intro call</p>
          <Split parts={["Schedule a 30 minute meeting."]} />
          <p className="lead rv">Tell us about your brand and your goals. We will tell you what we would do first. No long pitch, no pressure.</p>
          <ul className="facts rv">
            <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>30 minutes, on a video or phone call</li>
            <li><svg viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" /></svg>Free, with a clear next step at the end</li>
            <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>All times shown in IST (India)</li>
          </ul>
        </div>

        <div className="sched rv">
          {msg === null ? (
            <div>
              <h3>Pick a day and time</h3>
              <div className="step">1 · Choose a day</div>
              <div className="days" role="group" aria-label="Choose a day">
                {days.map((d, i) => (
                  <button key={i} type="button" className="day" aria-pressed={i === day} onClick={() => { setDay(i); clearErr(); }}>
                    {DN[d.getDay()]}<b>{d.getDate()}</b>{MN[d.getMonth()]}
                  </button>
                ))}
              </div>
              <div className="step">2 · Choose a time (IST)</div>
              <div className="slots" role="group" aria-label="Choose a time">
                {TIMES.map((t, i) => (
                  <button key={t} type="button" className="slot" aria-pressed={i === time} onClick={() => { setTime(i); clearErr(); }}>{t}</button>
                ))}
              </div>
              <p className="pick" aria-live="polite">{pick}</p>
              <div className="step">3 · Your details</div>
              <form onSubmit={submit} noValidate>
                <div className="fields">
                  <div><label htmlFor="fName">Name</label><input id="fName" name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={set("name")} /></div>
                  <div><label htmlFor="fContact">Email or phone</label><input id="fContact" name="contact" autoComplete="email" placeholder="you@brand.com or +91…" value={form.contact} onChange={set("contact")} /></div>
                  <div className="full">
                    <label htmlFor="fTopic">What do you want to talk about?</label>
                    <select id="fTopic" name="topic" value={form.topic} onChange={set("topic")}>
                      {["Not sure yet", ...SERVICES.map((s) => s.n)].map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="full"><label htmlFor="fNotes">Anything we should know? (optional)</label><textarea id="fNotes" name="notes" placeholder="Your brand, goals, timeline…" value={form.notes} onChange={set("notes")} /></div>
                </div>
                <p className="err" role="alert">{err}</p>
                <button className="btn" type="submit">Request this slot</button>
              </form>
            </div>
          ) : (
            <div className="done">
              <h3>Your request is ready</h3>
              <div className="sum">
                {msg.split("\n").slice(1).map((l, i) => { const k = l.indexOf(":"); return <div key={i}><b>{l.slice(0, k)}</b>{l.slice(k)}</div>; })}
              </div>
              <div className="row">
                <a className="btn" href={`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener">Send on WhatsApp</a>
                <button className="btn ghost" type="button" onClick={async () => { setCopyLabel(await copyText(msg)); setTimeout(() => setCopyLabel("Copy details"), 1600); }}>{copyLabel}</button>
                <button className="btn ghost" type="button" onClick={() => setMsg(null)}>Change slot</button>
              </div>
              <small>Nothing has been sent yet. Tap Send on WhatsApp, or email the details to <span className="mail">{EMAIL}</span>, and we will confirm your slot.</small>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
