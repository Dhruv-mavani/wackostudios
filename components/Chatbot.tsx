"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ATTENTION, ATTENTION_MAX_PER_VISIT, CHATBOT, CHAT_LIMITS, THINKING, type Attention, type ChatMessage } from "@/lib/chatbot";
import { SERVICES, WA } from "@/lib/data";
import { SERVICE_ART } from "@/lib/serviceArt";
import { goTo } from "@/lib/scroll";
import Waz, { WazStyle, type WazMood, type WazMove } from "./Waz";

type Face = { mood: WazMood; move: WazMove };
type Msg = ChatMessage & { error?: boolean; lead?: boolean; booked?: boolean; options?: string[] };

const STORE = "wk-chat";
const QUIET = "wk-chat-quiet"; // set once the visitor opens the chat or hides the tips
const SEEN = "wk-chat-clouds"; // how many clouds were shown this visit

// Which part of the page is in the middle of the screen, so his lines can fit what the visitor is looking at.
function whereAmI(): Attention["pool"] {
  const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest("#intro,#services,#clients,#reels,#book,#faq,#contact");
  return (el?.id as Attention["pool"]) || "any";
}

// Waz in the site palette: orange head, navy suit.
const WAZ_COLORS = { "--waz-skin": "var(--orange)", "--waz-ink": "var(--navy)" } as CSSProperties;

/** Round avatar: Waz's head. `mood` and `move` pick his expression and movement (see WAZ.md for the full list). */
function Avatar({ mood = "happy", move = "none", className = "" }: { mood?: WazMood; move?: WazMove; className?: string }) {
  return (
    <span className={`cb-av ${className}`} aria-hidden="true">
      <Waz bare crop="avatar" size={96} mood={mood} move={move} style={WAZ_COLORS} />
    </span>
  );
}

const RECAP = /^(Topic|Day|Time|When|Name|Email|Brand|Notes):\s*(.+)$/;

/** A reply's body. Lines like "Day: Thu 5 Nov, 10:00 AM IST" become a tidy summary card, so a booking recap is easy to scan. */
function Body({ text }: { text: string }) {
  const lines = text.split("\n");
  const rows = lines.map((l) => RECAP.exec(l.trim()));
  if (rows.filter(Boolean).length < 3) return <>{linkify(text)}</>;
  const first = rows.findIndex(Boolean), last = rows.length - 1 - [...rows].reverse().findIndex(Boolean);
  const before = lines.slice(0, first).join("\n").trim(), after = lines.slice(last + 1).join("\n").trim();
  return (
    <>
      {before && <span className="cb-pre">{linkify(before)}</span>}
      <dl className="cb-recap">
        {rows.slice(first, last + 1).map((r, i) => r && <div key={i}><dt>{r[1]}</dt><dd>{linkify(r[2])}</dd></div>)}
      </dl>
      {after && <span className="cb-pre">{linkify(after)}</span>}
    </>
  );
}

/** The typing bubble: the brand asterisk spins while a silly phrase shimmers, swapped every couple of seconds from a shuffled deck so none repeats until all have been seen. */
function Thinking() {
  const [deck] = useState(() => [...THINKING].sort(() => Math.random() - 0.5));
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((i) => i + 1), 2300);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="cb-b cb-think" role="status" aria-label={`${CHATBOT.name} is typing`}>
      <svg className="cb-spin" viewBox="0 0 128 120" aria-hidden="true"><use href="#wedge" /></svg>
      <span className="cb-word" key={n} aria-hidden="true">{deck[n % deck.length]}</span>
    </div>
  );
}

const TIME_BTN = /^\d{1,2}:\d{2}\s?[AP]M$/i;
const DAY_BTN = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*\s+(\d{1,2})\s+([A-Za-z]{3})/;
const SERVICE_BY_NAME = new Map(SERVICES.map((s) => [s.n.toLowerCase(), s]));

/** Swipeable service cards: a small drawing, the name and arrows to page through, instead of a tall stack of pills. */
function ServiceRail({ options, onPick }: { options: string[]; onPick: (o: string) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const page = (dir: number) => rail.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  return (
    <div className="cb-rail-wrap">
      <div className="cb-rail" ref={rail} role="group" aria-label="Choose a service">
        {options.map((o) => {
          const s = SERVICE_BY_NAME.get(o.toLowerCase());
          return (
            <button type="button" key={o} className={`cb-svc${s ? "" : " other"}`} onClick={() => onPick(o)}>
              {s ? <svg viewBox="0 0 120 120" aria-hidden="true">{SERVICE_ART[s.i]}</svg> : <span className="cb-q" aria-hidden="true">?</span>}
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      <small className="cb-rail-hint" aria-hidden="true">Swipe for all {options.length - 1} services</small>
      <button type="button" className="cb-arr l" onClick={() => page(-1)} aria-label="Previous services" tabIndex={-1}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg></button>
      <button type="button" className="cb-arr r" onClick={() => page(1)} aria-label="More services" tabIndex={-1}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></button>
    </div>
  );
}

/** Quick replies under Wacky's latest message, shaped to what is being asked: service cards, date tiles, time buttons or plain buttons. */
function Options({ options, onPick }: { options: string[]; onPick: (o: string) => void }) {
  const services = options.filter((o) => SERVICE_BY_NAME.has(o.toLowerCase()));
  if (services.length >= 3) return <ServiceRail options={options} onPick={onPick} />;
  const days = options.filter((o) => DAY_BTN.test(o));
  if (days.length >= 2) {
    return (
      <div className="cb-days" role="group" aria-label="Choose a day">
        {options.map((o) => {
          const m = DAY_BTN.exec(o);
          return m
            ? <button type="button" key={o} className="cb-day" onClick={() => onPick(o)} aria-label={o}><small>{m[1]}</small><b>{m[2]}</b><small>{m[3]}</small></button>
            : <button type="button" key={o} className="cb-day more" onClick={() => onPick(o)}>{o}</button>;
        })}
      </div>
    );
  }
  if (options.length >= 2 && options.every((o) => TIME_BTN.test(o))) {
    return <div className="cb-times" role="group" aria-label="Choose a time">{options.map((o) => <button type="button" key={o} onClick={() => onPick(o)}>{o}</button>)}</div>;
  }
  return (
    <div className="cb-opts" role="group" aria-label="Quick replies">
      {options.map((o, i) => <button type="button" key={o} className={i === 0 && options.length === 2 ? "primary" : ""} onClick={() => onPick(o)}>{o}</button>)}
    </div>
  );
}

/** Turns links, emails and phone numbers in a reply into real links; everything else stays plain text. */
function linkify(text: string): ReactNode[] {
  const re = /(https?:\/\/[^\s]+[^\s.,;:!?)]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|\+?\d[\d\s-]{8,14}\d)/g;
  return text.split(re).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = /^https?:/.test(part) ? part : part.includes("@") ? `mailto:${part}` : `tel:${part.replace(/[^\d+]/g, "")}`;
    return <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">{part}</a>;
  });
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [cloud, setCloud] = useState<string | null>(null); // what Wacky is currently saying above his button
  const [face, setFace] = useState<Face>({ mood: "happy", move: "idle" });
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const calm = useRef(0);
  const recent = useRef<string[]>([]);

  // Restore this visit's conversation.
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const saved = sessionStorage.getItem(STORE);
        if (saved) setMsgs(JSON.parse(saved));
      } catch { /* storage blocked: the chat still works, it just won't be remembered */ }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-40))); } catch { /* ignore */ }
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy, open]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus({ preventScroll: true });
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); launcher.current?.focus(); } };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open]);

  // Wacky acts out the chat: a mood and a movement for a moment, then back to resting.
  const act = useCallback((mood: WazMood, move: WazMove, ms = 2000) => {
    clearTimeout(calm.current);
    setFace({ mood, move });
    calm.current = window.setTimeout(() => setFace({ mood: "happy", move: "idle" }), ms);
  }, []);
  useEffect(() => () => clearTimeout(calm.current), []);

  // Wacky starts the conversation: while the chat is closed he waves, pulls faces and says something in a thought cloud, with lines
  // that fit the part of the page the visitor is looking at. It stays occasional (and stops for the visit once the visitor opens the
  // chat, hides the tips, or has seen ATTENTION_MAX_PER_VISIT clouds), so it is friendly rather than annoying.
  useEffect(() => {
    if (open) return;
    let timer = 0, alive = true;
    const quiet = () => { try { return !!sessionStorage.getItem(QUIET) || +(sessionStorage.getItem(SEEN) ?? 0) >= ATTENTION_MAX_PER_VISIT; } catch { return false; } };
    const later = (ms: number) => { timer = window.setTimeout(speak, ms); };
    function speak() {
      if (!alive || quiet()) return;
      // not while the loading screen is up or the tab is in the background
      if (document.visibilityState !== "visible" || document.documentElement.classList.contains("is-loading")) return later(4000);
      const here = whereAmI();
      const fits = ATTENTION.filter((a) => (a.pool === here || a.pool === "any") && !recent.current.includes(a.say));
      const own = fits.filter((a) => a.pool === here && here !== "any");
      const pool = own.length && Math.random() < 0.6 ? own : fits;
      const line = pool[Math.floor(Math.random() * pool.length)];
      if (!line) { recent.current = []; return later(6000); }
      recent.current = [...recent.current.slice(-12), line.say];
      try { sessionStorage.setItem(SEEN, String(+(sessionStorage.getItem(SEEN) ?? 0) + 1)); } catch { /* ignore */ }
      setCloud(line.say);
      act(line.mood, line.move, 4800);
      timer = window.setTimeout(() => { setCloud(null); later(9000 + Math.random() * 8000); }, 5200);
    }
    later(7000);
    return () => { alive = false; clearTimeout(timer); };
  }, [open, act]);

  const hush = () => { setCloud(null); try { sessionStorage.setItem(QUIET, "1"); } catch { /* ignore */ } };

  async function send(raw: string) {
    const content = raw.trim().slice(0, CHAT_LIMITS.chars);
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next); setText(""); setBusy(true); clearTimeout(calm.current);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Error bubbles are local notices, not part of the conversation the model sees.
        body: JSON.stringify({ messages: next.filter((m) => !m.error).map(({ role, content }) => ({ role, content })), done: { booked: next.some((m) => m.booked), lead: next.some((m) => m.lead) } }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setMsgs([...next, { role: "assistant", content: data.reply, lead: !!data.leadSaved, booked: !!data.booked, options: Array.isArray(data.options) ? data.options : [] }]);
        if (data.leadSaved || data.booked) act("wink", "bounce", 2600); else act("happy", "talk", 1800);
      } else {
        setMsgs([...next, { role: "assistant", content: res.status === 429 && data.error ? data.error : CHATBOT.offline, error: true }]);
        act("oops", "shake", 2600);
      }
    } catch {
      setMsgs([...next, { role: "assistant", content: CHATBOT.offline, error: true }]);
      act("oops", "shake", 2600);
    }
    setBusy(false);
  }

  const book = () => { setOpen(false); goTo("#book"); };
  const fresh = msgs.length === 0;
  // While a reply is on its way Wacky thinks and types; otherwise he shows whatever he last acted out.
  const lastBot = msgs.findLastIndex((m) => m.role === "assistant");
  const now: Face = busy ? { mood: "thinking", move: "typing" } : face;

  return (
    <div className={`cb${open ? " open" : ""}`} style={WAZ_COLORS}>
      <WazStyle />

      <section className="cb-panel" role="dialog" aria-label={`Chat with ${CHATBOT.name}`} aria-hidden={!open} inert={!open}>
        <header className="cb-head">
          <Avatar className="lg" mood={now.mood} move={now.move} />
          <div className="cb-who"><b>{CHATBOT.name}</b><span>{CHATBOT.role}</span></div>
          <button type="button" className="cb-x" onClick={() => { setOpen(false); launcher.current?.focus(); }} aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        <div className="cb-log" ref={log} role="log" aria-live="polite" aria-relevant="additions">
          <div className="cb-row bot"><Avatar mood={fresh ? now.mood : "excited"} move={fresh ? now.move : "none"} /><p className="cb-b">{CHATBOT.greeting}</p></div>
          {msgs.map((m, i) => (
            <div key={i} className={`cb-row ${m.role === "user" ? "me" : "bot"}`}>
              {m.role === "assistant" && (i === lastBot && !busy
                ? <Avatar mood={now.mood} move={now.move} />
                : <Avatar mood={m.error ? "oops" : m.lead || m.booked ? "wink" : "happy"} />)}
              <div className="cb-col">
                <div className={`cb-b${m.error ? " err" : ""}`}>{m.role === "assistant" ? <Body text={m.content} /> : m.content}</div>
                {(m.lead || m.booked) && <span className="cb-sent">{m.booked ? "Booking request sent to the team" : "Sent to the team"}</span>}
                {m.error && <a className="cb-wa" href={`https://wa.me/${WA}`} target="_blank" rel="noopener">Message us on WhatsApp</a>}
              </div>
            </div>
          ))}
          {!busy && msgs.length > 0 && msgs[msgs.length - 1].options?.length ? (
            <Options options={msgs[msgs.length - 1].options!} onPick={(o) => { act("excited", "bounce", 1200); send(o); }} />
          ) : null}
          {busy && <div className="cb-row bot"><Avatar mood="thinking" move="typing" /><Thinking /></div>}
        </div>

        {fresh && (
          <div className="cb-starters">
            {CHATBOT.starters.map((s) => <button type="button" key={s} onClick={() => { act("excited", "bounce", 1200); send(s); }}>{s}</button>)}
          </div>
        )}

        <form className="cb-form" onSubmit={(e) => { e.preventDefault(); send(text); }}>
          <textarea
            ref={input} rows={1} value={text} maxLength={CHAT_LIMITS.chars} placeholder={CHATBOT.placeholder} aria-label="Your message"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }}
          />
          <button type="submit" className="cb-send" disabled={busy || !text.trim()} aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
          </button>
        </form>
        <div className="cb-foot">
          <button type="button" onClick={book}>Book a call</button>
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener">WhatsApp</a>
          <span>AI bot, can be wrong</span>
        </div>
      </section>

      <div className="cb-dock">
      {cloud && !open && (
        <div className="cb-cloud" key={cloud} aria-hidden="true">
          <button type="button" tabIndex={-1} className="cb-cloud-t" onClick={() => { hush(); setOpen(true); act("happy", "wave", 2200); }}>{cloud}</button>
          <button type="button" tabIndex={-1} className="cb-cloud-x" aria-label="Hide tips" onClick={hush}>×</button>
          <i className="cb-trail a" /><i className="cb-trail b" />
        </div>
      )}
      <button type="button" ref={launcher} className="cb-fab" onClick={() => { if (!open) { act("happy", "wave", 2200); hush(); } setOpen((o) => !o); }} aria-expanded={open} aria-label={open ? "Close chat" : `Chat with ${CHATBOT.name}`}>
        <Avatar className="fab" mood={now.mood} move={now.move} />
        <svg className="cb-fab-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      </div>
    </div>
  );
}
