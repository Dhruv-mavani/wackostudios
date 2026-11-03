"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CHATBOT, CHAT_LIMITS, type ChatMessage } from "@/lib/chatbot";
import { WA } from "@/lib/data";
import { goTo } from "@/lib/scroll";
import Waz, { WazStyle, type WazMood, type WazMove } from "./Waz";

type Face = { mood: WazMood; move: WazMove };
type Msg = ChatMessage & { error?: boolean; lead?: boolean };

const STORE = "wk-chat";
const NUDGE = "wk-chat-nudged";

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
  const [nudge, setNudge] = useState(false);
  const [face, setFace] = useState<Face>({ mood: "happy", move: "idle" });
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const calm = useRef(0);

  // Restore this visit's conversation, and pop the small "Ask me anything" bubble once.
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const saved = sessionStorage.getItem(STORE);
        if (saved) setMsgs(JSON.parse(saved));
        else if (!sessionStorage.getItem(NUDGE)) {
          sessionStorage.setItem(NUDGE, "1");
          window.setTimeout(() => setNudge(true), 9000);
        }
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

  // Waz acts out the chat: a mood and a movement for a moment, then back to resting.
  const act = (mood: WazMood, move: WazMove, ms = 2000) => {
    clearTimeout(calm.current);
    setFace({ mood, move });
    calm.current = window.setTimeout(() => setFace({ mood: "happy", move: "idle" }), ms);
  };
  useEffect(() => () => clearTimeout(calm.current), []);

  async function send(raw: string) {
    const content = raw.trim().slice(0, CHAT_LIMITS.chars);
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next); setText(""); setBusy(true); setNudge(false); clearTimeout(calm.current);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Error bubbles are local notices, not part of the conversation the model sees.
        body: JSON.stringify({ messages: next.filter((m) => !m.error).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setMsgs([...next, { role: "assistant", content: data.reply, lead: !!data.leadSaved }]);
        if (data.leadSaved) act("wink", "bounce", 2600); else act("happy", "talk", 1800);
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
  // While a reply is on its way Waz thinks and types; otherwise he shows whatever he last acted out.
  const lastBot = msgs.findLastIndex((m) => m.role === "assistant");
  const now: Face = busy ? { mood: "thinking", move: "typing" } : face;

  return (
    <div className={`cb${open ? " open" : ""}`} style={WAZ_COLORS}>
      <WazStyle />
      {nudge && !open && <button type="button" className="cb-nudge" onClick={() => { setNudge(false); setOpen(true); act("happy", "wave", 2200); }}>{CHATBOT.nudge}</button>}

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
                : <Avatar mood={m.error ? "oops" : m.lead ? "wink" : "happy"} />)}
              <div className="cb-col">
                <p className={`cb-b${m.error ? " err" : ""}`}>{m.role === "assistant" ? linkify(m.content) : m.content}</p>
                {m.lead && <span className="cb-sent">Sent to the team</span>}
                {m.error && <a className="cb-wa" href={`https://wa.me/${WA}`} target="_blank" rel="noopener">Message us on WhatsApp</a>}
              </div>
            </div>
          ))}
          {busy && <div className="cb-row bot"><Avatar mood="thinking" move="typing" /><p className="cb-b cb-dots" aria-label={`${CHATBOT.name} is typing`}><i /><i /><i /></p></div>}
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

      <button type="button" ref={launcher} className="cb-fab" onClick={() => { if (!open) act("happy", "wave", 2200); setOpen((o) => !o); setNudge(false); }} aria-expanded={open} aria-label={open ? "Close chat" : `Chat with ${CHATBOT.name}`}>
        <Avatar className="fab" mood={now.mood} move={now.move} />
        <svg className="cb-fab-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  );
}
