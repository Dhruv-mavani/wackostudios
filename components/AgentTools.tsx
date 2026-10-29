"use client";

import { useEffect } from "react";
import { SERVICES, TIMES } from "@/lib/data";
import { FAQ, SITE } from "@/lib/seo";

type Tool = { name: string; description: string; inputSchema: object; execute: (args: Record<string, string>) => Promise<unknown> };
type ModelContext = { registerTool?: (t: Tool) => { unregister?: () => void } | void };

const json = (data: unknown) => ({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }] });

// React-controlled fields only see a change if the native setter runs before the input event.
function fill(id: string, value: string) {
  const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  if (!el || !value) return;
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(new Event(el instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
}

/**
 * Agentic browsing: exposes the site's actions as structured tools through the WebMCP draft API
 * (navigator.modelContext). A no-op in browsers without it. Nothing here submits or sends anything.
 */
export default function AgentTools() {
  useEffect(() => {
    const mc = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!mc?.registerTool) return;

    const tools: Tool[] = [
      {
        name: "get_agency_profile",
        description: "Facts about Wacko Studios: what it does, where it is based, and how to contact it.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => json({ name: SITE.name, tagline: SITE.tagline, description: SITE.description, location: "India", contact: { email: SITE.email, phone: SITE.phone, instagram: SITE.instagram } }),
      },
      {
        name: "list_services",
        description: "The services Wacko Studios offers, each with a description and what it includes.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => json(SERVICES.map((s) => ({ service: s.n, description: s.d, includes: s.c }))),
      },
      {
        name: "answer_faq",
        description: "Frequently asked questions about Wacko Studios, with answers.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => json(FAQ),
      },
      {
        name: "list_available_slots",
        description: "Days and times (IST) that can be requested for a free 30 minute intro call.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => json({ timezone: "IST", dates: Array.from(document.querySelectorAll<HTMLElement>(".day")).map((b) => b.dataset.date), times: TIMES }),
      },
      {
        name: "prepare_meeting_request",
        description: "Fill in the booking form on the page for a free 30 minute intro call. Selects the slot and fills the fields but does not submit; the user must press 'Request this slot' to send it to the team.",
        inputSchema: {
          type: "object",
          properties: {
            date: { type: "string", description: "Day as YYYY-MM-DD, from list_available_slots" },
            time: { type: "string", description: "Time in IST, for example '3:00 PM', from list_available_slots" },
            name: { type: "string", description: "Requester's name" },
            contact: { type: "string", description: "Requester's email or phone" },
            topic: { type: "string", description: "A service name, or 'Not sure yet'" },
            notes: { type: "string", description: "Brand, goals and timeline" },
          },
          required: ["date", "time", "name", "contact"],
        },
        execute: async ({ date, time, name, contact, topic, notes }) => {
          const dayBtn = document.querySelector<HTMLElement>(`.day[data-date="${date}"]`);
          const slotBtn = Array.from(document.querySelectorAll<HTMLElement>(".slot")).find((b) => b.dataset.time === time);
          if (!dayBtn || !slotBtn) return json({ ok: false, error: "That date or time is not available. Call list_available_slots for valid values." });
          dayBtn.click(); slotBtn.click();
          fill("fName", name); fill("fContact", contact); fill("fTopic", topic); fill("fNotes", notes);
          document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
          return json({ ok: true, note: "Form filled. Nothing has been sent. The user must press 'Request this slot' to send the request to the team." });
        },
      },
    ];

    const handles = tools.map((t) => { try { return mc.registerTool!(t); } catch { return null; } });
    return () => handles.forEach((h) => { try { h?.unregister?.(); } catch { /* ignore */ } });
  }, []);
  return null;
}
