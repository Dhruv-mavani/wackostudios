import { EMAIL, INSTAGRAM_URL, PHONE } from "./data";
import { SITE, SITE_URL } from "./seo";

/**
 * Branded HTML emails for the "Schedule a meeting" form.
 * Email clients are stuck in 2005: everything is table layout with inline styles, web-safe font fallbacks, and
 * bulletproof buttons. Colours match the site (navy #113462, orange #E77249, grey #F6F4F0).
 */
export type Booking = {
  name: string;
  /** brand or business name; may be empty */
  brand: string;
  email: string;
  topic: string;
  notes: string;
  /** YYYY-MM-DD, the day picked in the scheduler */
  date: string;
  /** "2:00 PM", the time picked (IST) */
  time: string;
  /** "Fri 30 Oct, 2:00 PM IST" */
  label: string;
};

const C = { navy: "#113462", navy2: "#1A4177", orange: "#E77249", grey: "#F6F4F0", white: "#FFFFFF", ink2: "#5B6478" };
const FONT = "'Poppins','Segoe UI',Helvetica,Arial,sans-serif";
const FONT_BODY = "'Montserrat','Segoe UI',Helvetica,Arial,sans-serif";

/**
 * A solid background that Gmail's mobile dark mode leaves alone. Gmail re-colours plain `background-color` values
 * (a deep navy turns into a flat grey), but not a `background-image`, so the same colour is also painted as a
 * one-colour gradient. The `bgcolor` attribute on cells is the fallback for clients that ignore both.
 */
const solid = (c: string) => `background:${c};background-image:linear-gradient(${c},${c});`;

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Google Calendar "add event" link for a 30 minute slot. The scheduler's times are IST (UTC+5:30). */
export function calendarUrl(b: Pick<Booking, "date" | "time" | "topic">, title: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(b.date);
  const t = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(b.time);
  if (!m || !t) return null;
  let h = Number(t[1]) % 12;
  if (t[3] === "PM") h += 12;
  const start = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), h, Number(t[2])) - 330 * 60_000;
  const fmt = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(start + 30 * 60_000)}`,
    details: `Intro call with Wacko Studios.\nTopic: ${b.topic}`,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/* ---------- building blocks ---------- */

const button = (href: string, label: string, kind: "primary" | "dark" | "ghost" = "primary") => {
  const style =
    kind === "primary" ? `${solid(C.orange)}color:#0A2650;border:2px solid ${C.orange};`
    : kind === "dark" ? `${solid(C.navy)}color:${C.white};border:2px solid ${C.navy};`
    : `background:${C.white};color:${C.navy};border:2px solid ${C.navy};`;
  return `<td style="padding:0 10px 10px 0"><a href="${esc(href)}" style="${style}display:inline-block;padding:13px 22px;border-radius:999px;font-family:${FONT};font-weight:700;font-size:14px;line-height:1;text-decoration:none">${esc(label)}</a></td>`;
};

const row = (label: string, valueHtml: string) => `
<tr>
  <td style="padding:14px 0;border-top:1px solid #E3E5EA;font-family:${FONT_BODY};font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.ink2};width:120px;vertical-align:top">${esc(label)}</td>
  <td style="padding:14px 0;border-top:1px solid #E3E5EA;font-family:${FONT_BODY};font-size:16px;font-weight:600;color:${C.navy};line-height:1.45;vertical-align:top">${valueHtml}</td>
</tr>`;

const header = `
<tr><td bgcolor="${C.navy}" style="${solid(C.navy)}padding:26px 32px 22px">
  <a href="${SITE_URL}" style="text-decoration:none"><img src="${SITE_URL}/logo.png" width="120" alt="Wacko Studios" style="display:block;border:0;outline:none;width:120px;height:auto"></a>
</td></tr>
<tr><td bgcolor="${C.orange}" style="${solid(C.orange)}height:6px;line-height:6px;font-size:0">&nbsp;</td></tr>`;

const footer = `
<tr><td bgcolor="${C.navy}" style="${solid(C.navy)}padding:28px 32px">
  <p style="margin:0 0 10px;font-family:${FONT};font-weight:800;font-size:18px;color:${C.white}">Wacko Studios</p>
  <p style="margin:0 0 14px;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:#B8BFCC">${esc(SITE.tagline)}</p>
  <p style="margin:0;font-family:${FONT_BODY};font-size:13px;line-height:1.9;color:#B8BFCC">
    <a href="mailto:${EMAIL}" style="color:${C.white};text-decoration:none">${EMAIL}</a><br>
    <a href="tel:${SITE.phoneE164}" style="color:${C.white};text-decoration:none">${esc(PHONE)}</a> &nbsp;·&nbsp;
    <a href="${esc(INSTAGRAM_URL)}" style="color:#FA9470;text-decoration:none">@wackostudios.in</a>
  </p>
</td></tr>`;

const shell = (preheader: string, body: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Wacko Studios</title></head>
<body style="margin:0;padding:0;background:${C.grey}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px">${esc(preheader)}&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.grey}"><tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-radius:22px;overflow:hidden;background:${C.white}">
    ${body}
  </table>
  <p style="margin:18px 0 0;font-family:${FONT_BODY};font-size:12px;color:${C.ink2}">Sent from <a href="${SITE_URL}" style="color:${C.ink2}">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>
</td></tr></table>
</body></html>`;

const hero = (eyebrow: string, label: string, sub: string) => `
<tr><td bgcolor="${C.orange}" style="${solid(C.orange)}padding:34px 32px 32px">
  <p style="margin:0 0 12px;font-family:${FONT_BODY};font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${C.navy}">${esc(eyebrow)}</p>
  <p style="margin:0;font-family:${FONT};font-weight:800;font-size:34px;line-height:1.05;letter-spacing:-.02em;color:${C.navy}">${esc(label)}</p>
  <p style="margin:12px 0 0;font-family:${FONT_BODY};font-size:15px;font-weight:600;color:${C.navy}">${esc(sub)}</p>
</td></tr>`;

/* ---------- 1. The email you receive ---------- */

export function renderOwnerEmail(b: Booking) {
  const emailHtml = `<a href="mailto:${esc(b.email)}" style="color:${C.navy};text-decoration:underline">${esc(b.email)}</a>`;

  const replySubject = `Re: Your meeting request, ${b.label}`;
  const replyBody = `Hi ${b.name},\n\nThanks for your request for ${b.label}. That works for us.\n\nWacko Studios`;
  const cal = calendarUrl(b, `Wacko Studios intro call: ${b.name}${b.brand ? ` (${b.brand})` : ""}`);

  const buttons = [
    button(`mailto:${b.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`, "Reply by email"),
    cal ? button(cal, "Add to calendar", "dark") : "",
  ].join("");

  const notes = b.notes
    ? `<tr><td colspan="2" style="padding:6px 0 4px">
        <p style="margin:14px 0 8px;font-family:${FONT_BODY};font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.ink2}">Their notes</p>
        <div style="background:${C.grey};border-left:4px solid ${C.orange};border-radius:6px;padding:14px 16px;font-family:${FONT_BODY};font-size:15px;line-height:1.6;color:${C.navy}">${esc(b.notes).replace(/\n/g, "<br>")}</div>
      </td></tr>`
    : "";

  const html = shell(
    `${b.name}${b.brand ? ` from ${b.brand}` : ""} would like a call on ${b.label}. Topic: ${b.topic}.`,
    `${header}
${hero("New meeting request", b.label, "30 minute intro call · India time (IST)")}
<tr><td style="padding:30px 32px 10px">
  <p style="margin:0 0 14px;font-family:${FONT};font-weight:800;font-size:22px;letter-spacing:-.01em;color:${C.navy}">${esc(b.name)} wants to talk.</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${row("Name", esc(b.name))}
    ${b.brand ? row("Brand", esc(b.brand)) : ""}
    ${row("Email", emailHtml)}
    ${row("Slot", `${esc(b.label)}`)}
    ${row("Topic", esc(b.topic))}
    ${notes}
  </table>
</td></tr>
<tr><td style="padding:14px 32px 34px">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${buttons}</tr></table>
  <p style="margin:6px 0 0;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${C.ink2}">Replying to this email goes straight to them. Nothing is booked until you confirm.</p>
</td></tr>
${footer}`,
  );

  const text = [
    `NEW MEETING REQUEST`,
    b.label,
    "",
    `Name: ${b.name}`,
    b.brand ? `Brand: ${b.brand}` : "",
    `Email: ${b.email}`,
    `Slot: ${b.label}`,
    `Topic: ${b.topic}`,
    b.notes ? `Notes: ${b.notes}` : "",
    "",
    cal ? `Add to calendar: ${cal}` : "",
  ].filter((l) => l !== "").join("\n");

  return { subject: `New meeting request: ${b.label} · ${b.name}${b.brand ? `, ${b.brand}` : ""}`, html, text };
}

/* ---------- 2. Optional confirmation to the visitor (needs a verified sending domain) ---------- */

export function renderVisitorEmail(b: Booking) {
  const cal = calendarUrl(b, "Intro call with Wacko Studios");
  const html = shell(
    `We got your request for ${b.label}. We will confirm shortly.`,
    `${header}
${hero("Request received", b.label, "30 minute intro call · India time (IST)")}
<tr><td style="padding:30px 32px 8px">
  <p style="margin:0 0 12px;font-family:${FONT};font-weight:800;font-size:22px;letter-spacing:-.01em;color:${C.navy}">Thanks, ${esc(b.name)}. You're on our radar.</p>
  <p style="margin:0 0 14px;font-family:${FONT_BODY};font-size:16px;line-height:1.65;color:${C.navy}">We have your request and will reply to confirm the slot, usually within one working day. Until then, nothing is locked in on either side.</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${row("Slot", esc(b.label))}
    ${row("Topic", esc(b.topic))}
  </table>
</td></tr>
<tr><td style="padding:18px 32px 34px">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    ${cal ? button(cal, "Add to calendar", "dark") : ""}
    ${button(`https://wa.me/${SITE.phoneE164.replace(/\D/g, "")}`, "Message us on WhatsApp", "ghost")}
  </tr></table>
  <p style="margin:6px 0 0;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${C.ink2}">Need to change anything? Just reply to this email.</p>
</td></tr>
${footer}`,
  );
  const text = [
    `Thanks, ${b.name}. We have your request for ${b.label} (IST) and will reply to confirm the slot.`,
    `Topic: ${b.topic}`,
    cal ? `Add to calendar: ${cal}` : "",
    "",
    `Wacko Studios · ${EMAIL} · ${PHONE}`,
  ].filter(Boolean).join("\n");
  return { subject: `We got your request: ${b.label}`, html, text };
}
