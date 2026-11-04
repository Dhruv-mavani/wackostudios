"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_DAYS_AHEAD, addDays, bookableDates, dayState, longDate, monthCells, monthTitle, shortDate, type DayState, type IstNow } from "@/lib/booking";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const WHY: Record<DayState, string> = {
  ok: "", past: "already passed", far: `more than ${MAX_DAYS_AHEAD} days away`, closed: "we are closed", full: "no slots left today", invalid: "",
};

const ym = (iso: string) => ({ y: +iso.slice(0, 4), m: +iso.slice(5, 7) - 1 });

/**
 * A date field that opens a month calendar right below it, like a booking form on a government site: past days, closed
 * days and days too far ahead are visibly unavailable and can't be chosen. Arrow keys, Home/End and PageUp/PageDown move
 * around, Enter picks, Escape closes. `now` is the current moment in IST (null until the page has hydrated).
 */
export default function DatePicker({ id, value, now, onChange }: { id: string; value: string | null; now: IstNow | null; onChange: (date: string) => void }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: 0, m: 0 });
  const [focus, setFocus] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLButtonElement>(null);
  const grabFocus = useRef(false);

  const first = now ? bookableDates(now)[0] ?? now.date : "";
  const last = now ? addDays(now.date, MAX_DAYS_AHEAD) : "";
  const clamp = (d: string) => (d < now!.date ? now!.date : d > last ? last : d);

  const show = (d: string) => { setFocus(d); setView(ym(d)); grabFocus.current = true; };
  const toggle = () => {
    if (!now) return;
    if (open) { setOpen(false); return; }
    setOpen(true);
    show(value && dayState(value, now) === "ok" ? value : first);
  };
  const close = (back = true) => { setOpen(false); if (back) field.current?.focus(); };
  const pick = (d: string) => { if (!now || dayState(d, now) !== "ok") return; onChange(d); close(); };

  // Move keyboard focus onto the highlighted day after a keyboard move or opening.
  useEffect(() => {
    if (!open || !grabFocus.current) return;
    grabFocus.current = false;
    root.current?.querySelector<HTMLElement>(`[data-date="${focus}"]`)?.focus();
  }, [open, focus, view]);

  // Click outside closes it.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!now) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
    const from = focus || first;
    const step: Record<string, string> = {
      ArrowLeft: addDays(from, -1), ArrowRight: addDays(from, 1), ArrowUp: addDays(from, -7), ArrowDown: addDays(from, 7),
      Home: addDays(from, -((new Date(from + "T00:00:00Z").getUTCDay() + 6) % 7)),
      End: addDays(from, 6 - ((new Date(from + "T00:00:00Z").getUTCDay() + 6) % 7)),
    };
    let next = step[e.key];
    if (e.key === "PageUp" || e.key === "PageDown") {
      const { y, m } = ym(from), n = new Date(Date.UTC(y + (e.shiftKey ? (e.key === "PageUp" ? -1 : 1) : 0), m + (e.shiftKey ? 0 : e.key === "PageUp" ? -1 : 1), 1));
      const dim = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + 1, 0)).getUTCDate();
      next = `${n.getUTCFullYear()}-${String(n.getUTCMonth() + 1).padStart(2, "0")}-${String(Math.min(+from.slice(8), dim)).padStart(2, "0")}`;
    }
    if (next) { e.preventDefault(); show(clamp(next)); }
  };

  const cells = open ? monthCells(view.y, view.m) : [];
  const today = ym(now?.date ?? "1970-01-01"), lastYm = ym(last || "1970-01-01");
  const canPrev = open && (view.y > today.y || (view.y === today.y && view.m > today.m));
  const canNext = open && (view.y < lastYm.y || (view.y === lastYm.y && view.m < lastYm.m));
  const go = (n: number) => {
    const d = new Date(Date.UTC(view.y, view.m + n, 1));
    setView({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
    setFocus("");
  };

  return (
    <div className="dp" ref={root}>
      <button type="button" id={id} ref={field} className="dp-field" onClick={toggle} aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-pop`} disabled={!now}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
        <span className={value ? "" : "ph"}>{value ? shortDate(value) : "Select a date"}</span>
        <svg className="dp-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && now && (
        <div className="dp-pop" id={`${id}-pop`} role="dialog" aria-label="Choose a date" onKeyDown={onKey}>
          <div className="dp-head">
            <button type="button" className="dp-nav" onClick={() => go(-1)} disabled={!canPrev} aria-label="Previous month">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <b className="dp-title" aria-live="polite">{monthTitle(view.y, view.m)}</b>
            <button type="button" className="dp-nav" onClick={() => go(1)} disabled={!canNext} aria-label="Next month">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>

          <div className="dp-week" aria-hidden="true">{WEEK.map((w) => <span key={w}>{w}</span>)}</div>
          <div className="dp-grid" role="grid" aria-label={monthTitle(view.y, view.m)}>
            {Array.from({ length: 6 }, (_, r) => (
              <div className="dp-row" role="row" key={r}>
                {cells.slice(r * 7, r * 7 + 7).map((d, c) => {
                  if (!d) return <span className="dp-gap" role="gridcell" key={c} />;
                  const s = dayState(d, now), ok = s === "ok", cur = d === (focus || (value ?? first));
                  return (
                    <button
                      key={d} type="button" role="gridcell" data-date={d}
                      className={`dp-d${d === value ? " sel" : ""}${d === now.date ? " today" : ""}${ok ? "" : " off"}`}
                      tabIndex={cur ? 0 : -1} aria-disabled={!ok} aria-selected={d === value}
                      aria-label={`${longDate(d)}${d === now.date ? ", today" : ""}${ok ? "" : `, unavailable, ${WHY[s]}`}`}
                      title={ok ? undefined : WHY[s]}
                      onClick={() => pick(d)}
                    >{+d.slice(8)}</button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="dp-foot">
            <span className="dp-key"><i className="t" />Today</span>
            <span className="dp-key"><i className="s" />Selected</span>
            <span className="dp-key"><i className="o" />Unavailable</span>
            <button type="button" className="dp-link" onClick={() => pick(first)}>Next available</button>
          </div>
        </div>
      )}
    </div>
  );
}
