/**
 * Chatbot settings that the page needs (safe for the browser). The server-side prompt lives in lib/chatServer.ts.
 * The character is Wacky, file name Waz (components/Waz.tsx, designer's notes in public/waz-character.zip > WAZ.md).
 */
export const SHOW_CHATBOT = true; // false = no chat button on the website and /api/chat answers 404

export const CHATBOT = {
  name: "Wacky",
  role: "Wacko's chat bot",
  greeting: "Yo! I'm Wacky, Wacko's bot. Half creative director, half chaos. What are we making loud today?",
  nudge: "Psst. Got a big idea? Ask Wacky.",
  starters: ["What do you do?", "I want to book a call", "Tell me about AI automation", "How do I get a quote?"],
  placeholder: "Tell Wacky what you need",
  // Shown when the server has no AI key yet, or it fails.
  offline: "I tripped over a cable and lost my brain for a second. Message the team on WhatsApp or email and they'll reply.",
} as const;

export const CHAT_LIMITS = { turns: 16, chars: 800 } as const;

export type ChatMessage = { role: "user" | "assistant"; content: string };
