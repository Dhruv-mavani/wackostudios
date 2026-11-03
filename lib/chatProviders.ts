import type { ChatMessage } from "./chatbot";
import { LEAD_TOOL } from "./chatServer";

/**
 * The AI models behind the chat, tried in order until one answers. Each attempt is independent: if a model is rate
 * limited, down or slow, the next one gets the whole conversation from the start.
 *
 *   1. Gemini main model        GEMINI_API_KEY        free tier at https://aistudio.google.com/apikey
 *   2. Gemini fallback model    same key              a second model has its own free quota, so one busy model doesn't stop the chat
 *   3. Claude (optional)        ANTHROPIC_API_KEY     paid, only used if both Gemini models fail, so it costs next to nothing
 */
export type RunTool = (name: string, input: Record<string, unknown>) => Promise<{ ok: boolean; message: string }>;
export type Attempt = { label: string; run: (messages: ChatMessage[], system: string, runTool: RunTool) => Promise<string> };

const MAX_STEPS = 3; // model calls per attempt: a reply, plus at most one tool round trip
// The first model gets a short leash so a slow answer hands over to the next model quickly; later ones get longer.
const FIRST_TIMEOUT_MS = 7_000, LATER_TIMEOUT_MS = 12_000;

/* ---------- Gemini (generateContent REST API) ---------- */

type GPart = { text?: string; thought?: boolean; functionCall?: { name: string; args?: Record<string, unknown> }; [k: string]: unknown };
type GTurn = { role: "user" | "model"; parts: unknown[] };

// Gemini wants OpenAPI-style upper-case type names.
const upperTypes = (s: unknown): unknown =>
  Array.isArray(s) ? s.map(upperTypes)
    : s && typeof s === "object" ? Object.fromEntries(Object.entries(s).map(([k, v]) => [k, k === "type" && typeof v === "string" ? v.toUpperCase() : upperTypes(v)]))
      : s;

function gemini(model: string, key: string, timeoutMs: number): Attempt {
  return {
    label: `gemini:${model}`,
    async run(messages, system, runTool) {
      const convo: GTurn[] = messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
      for (let step = 0; step < MAX_STEPS; step++) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
          method: "POST",
          headers: { "x-goog-api-key": key, "content-type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: convo,
            tools: [{ functionDeclarations: [{ name: LEAD_TOOL.name, description: LEAD_TOOL.description, parameters: upperTypes(LEAD_TOOL.input_schema) }] }],
            // Newer Gemini models spend some of this budget on thinking, so it is generous.
            generationConfig: { maxOutputTokens: 1024, temperature: 0.8 },
          }),
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (!res.ok) throw new Error(`Gemini ${model} answered ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
        const data: { candidates?: { content?: { parts?: GPart[] } }[] } = await res.json();
        const parts = data.candidates?.[0]?.content?.parts ?? [];
        const text = parts.filter((p) => p.text && !p.thought).map((p) => p.text).join("\n").trim();
        const calls = parts.filter((p) => p.functionCall);
        if (!calls.length) { if (!text) throw new Error(`Gemini ${model} returned no text`); return text; }

        // Replay the model's own parts untouched (newer models attach signatures that must come back), then answer each call.
        convo.push({ role: "model", parts });
        const responses = [];
        for (const c of calls) {
          const out = await runTool(c.functionCall!.name, c.functionCall!.args ?? {});
          responses.push({ functionResponse: { name: c.functionCall!.name, response: out.ok ? { result: out.message } : { error: out.message } } });
        }
        convo.push({ role: "user", parts: responses });
      }
      throw new Error(`Gemini ${model} kept calling tools`);
    },
  };
}

/* ---------- Claude (Anthropic Messages API) ---------- */

type Block = { type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> };

function claude(model: string, key: string, timeoutMs: number): Attempt {
  return {
    label: `claude:${model}`,
    async run(messages, system, runTool) {
      const convo: { role: "user" | "assistant"; content: string | unknown[] }[] = messages.map((m) => ({ ...m }));
      for (let step = 0; step < MAX_STEPS; step++) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({ model, max_tokens: 400, system, tools: [LEAD_TOOL], messages: convo }),
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (!res.ok) throw new Error(`Claude ${model} answered ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
        const data: { content?: Block[]; stop_reason?: string } = await res.json();
        const blocks = data.content ?? [];
        const text = blocks.filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n").trim();
        const calls = blocks.filter((b) => b.type === "tool_use");
        if (data.stop_reason !== "tool_use" || !calls.length) { if (!text) throw new Error(`Claude ${model} returned no text`); return text; }

        const results = [];
        for (const c of calls) {
          const out = await runTool(c.name ?? "", c.input ?? {});
          results.push({ type: "tool_result", tool_use_id: c.id, content: out.message, ...(out.ok ? {} : { is_error: true }) });
        }
        convo.push({ role: "assistant", content: blocks }, { role: "user", content: results });
      }
      throw new Error(`Claude ${model} kept calling tools`);
    },
  };
}

/** The models to try, in order, from whatever keys are set. Empty means the chat is not configured. */
export function attempts(): Attempt[] {
  const list: Attempt[] = [];
  const g = process.env.GEMINI_API_KEY;
  if (g) {
    const main = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
    const spare = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.6-flash";
    list.push(gemini(main, g, FIRST_TIMEOUT_MS));
    if (spare !== main) list.push(gemini(spare, g, LATER_TIMEOUT_MS));
  }
  const a = process.env.ANTHROPIC_API_KEY;
  if (a) list.push(claude(process.env.CHAT_MODEL || "claude-haiku-5-5", a, list.length ? LATER_TIMEOUT_MS : FIRST_TIMEOUT_MS));
  return list;
}
