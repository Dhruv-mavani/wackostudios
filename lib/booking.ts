import { TIMES } from "./data";

/**
 * Rules for which days and times can be requested for an intro call. Shared by the date picker (so unavailable days
 * look unavailable) and /api/book (so a hand-made request can't sneak a past date through).
 *
 * Dates are plain "YYYY-MM-DD" strings in IST, the only timezone the scheduler speaks, so a visitor's own timezone or
 * device clock never shifts a day. "Now" is always read in IST too.
 */
export const MAX_DAYS_AHEAD = 60;      // furthest day that can be requested
export const MIN_LEAD_HOURS = 3;       // a slot today needs at least this much notice
export const CLOSED_WEEKDAYS = [0];    // 0 = Sunday
export const CLOSED_DATES: string[] = []; // holidays, "YYYY-MM-DD" in IST, e.g. "2026-11-08"

const IST = "Asia/Kolkata";
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export type IstNow = { date: string; minutes: number };
export type DayState = "ok" | "past" | "far" | "closed" | "full" | "invalid";

const pad = (n: number) => String(n).padStart(2, "0");
const utc = (iso: string) => { const m = ISO.exec(iso)!; return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); };
const fmt = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

/** True for a real calendar date such as 2026-11-04 (rejects 2026-02-30 and the like). */
export const isIsoDate = (iso: string) => {
  const m = ISO.exec(iso);
  return !!m && fmt(utc(iso)) === iso;
};

export const addDays = (iso: string, n: number) => { const d = utc(iso); d.setUTCDate(d.getUTCDate() + n); return fmt(d); };
export const weekday = (iso: string) => utc(iso).getUTCDay();

/** Today's date and the minutes since midnight, read in India. */
export function istNow(ms = Date.now()): IstNow {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(ms).map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: +p.hour * 60 + +p.minute };
}

/** "2:00 PM" -> minutes since midnight, or -1 if it isn't a time we know. */
export function slotMinutes(t: string) {
  const m = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(t);
  if (!m) return -1;
  return (+m[1] % 12 + (m[3] === "PM" ? 12 : 0)) * 60 + +m[2];
}

/** Whether a time slot is still far enough ahead on the given day. Only today is limited. */
const slotOpen = (date: string, t: string, now: IstNow) => date !== now.date || slotMinutes(t) >= now.minutes + MIN_LEAD_HOURS * 60;

export function dayState(date: string, now: IstNow): DayState {
  if (!isIsoDate(date)) return "invalid";
  if (date < now.date) return "past";
  if (date > addDays(now.date, MAX_DAYS_AHEAD)) return "far";
  if (CLOSED_WEEKDAYS.includes(weekday(date)) || CLOSED_DATES.includes(date)) return "closed";
  if (date === now.date && !TIMES.some((t) => slotOpen(date, t, now))) return "full";
  return "ok";
}

export const slotState = (date: string, t: string, now: IstNow) => dayState(date, now) === "ok" && slotOpen(date, t, now);

/** Why a date + time can't be requested, in words for the visitor, or "" if it can. */
export function bookingError(date: string, time: string, now: IstNow) {
  if (!TIMES.includes(time)) return "Please choose one of the listed times.";
  const s = dayState(date, now);
  if (s === "past") return "That day has already passed. Please choose another day.";
  if (s === "far") return `We take bookings up to ${MAX_DAYS_AHEAD} days ahead. Please choose an earlier day.`;
  if (s === "closed") return "We are closed that day. Please choose another day.";
  if (s === "full") return "There are no slots left today. Please choose another day.";
  if (s === "invalid") return "Please choose a day first.";
  if (!slotOpen(date, time, now)) return `Today's slots need at least ${MIN_LEAD_HOURS} hours' notice. Please choose a later time or another day.`;
  return "";
}

/** Every day that can currently be requested. */
export function bookableDates(now: IstNow) {
  const out: string[] = [];
  for (let i = 0; i <= MAX_DAYS_AHEAD; i++) { const d = addDays(now.date, i); if (dayState(d, now) === "ok") out.push(d); }
  return out;
}

/** The six Monday-first weeks of a month as a flat list of 42 cells (null = a day from the neighbouring month). */
export function monthCells(year: number, month: number): (string | null)[] {
  const first = new Date(Date.UTC(year, month, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Monday = 0
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length: 42 }, (_, i) => { const n = i - lead + 1; return n >= 1 && n <= days ? `${year}-${pad(month + 1)}-${pad(n)}` : null; });
}

const LONG = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const SHORT = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const MONTH = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
export const longDate = (iso: string) => LONG.format(utc(iso));
export const shortDate = (iso: string) => SHORT.format(utc(iso));
export const monthTitle = (year: number, month: number) => MONTH.format(new Date(Date.UTC(year, month, 1)));

const DN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "Fri 30 Oct, 2:00 PM IST", the wording used in the emails. */
export const bookingLabel = (date: string, time: string) => { const d = utc(date); return `${DN[d.getUTCDay()]} ${d.getUTCDate()} ${MN[d.getUTCMonth()]}, ${time} IST`; };

/** "Thu 5 Nov", the short day wording used on chat buttons. */
export const dayLabel = (date: string) => { const d = utc(date); return `${DN[d.getUTCDay()]} ${d.getUTCDate()} ${MN[d.getUTCMonth()]}`; };

/** The time slots still open on a day (none if the day itself can't be booked). */
export const openTimes = (date: string, now: IstNow) => TIMES.filter((t) => slotState(date, t, now));

/** "11:30 AM", for telling the model what time it is in India. */
export const clockText = (minutes: number) => `${(Math.floor(minutes / 60) % 12) || 12}:${String(minutes % 60).padStart(2, "0")} ${minutes >= 720 ? "PM" : "AM"}`;
