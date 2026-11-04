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

/** What Wacky "does" while a reply loads. One is picked at random and swapped every couple of seconds, never repeating until the whole list has been used. */
export const THINKING = [
  "Cooking up an idea", "Consulting my one brain cell", "Brainstorming loudly", "Sharpening the quiff", "Polishing the pitch",
  "Doodling on a napkin", "Hunting for the big idea", "Making it louder", "Warming up the hype engine", "Hunting for a pun",
  "Rehearsing a plot twist", "Untangling the cables", "Asking the muse", "Shuffling the mood board", "Stretching my creative muscles",
  "Rubbing the lucky wedge", "Bribing the algorithm", "Counting the thumbs", "Tuning the vibe", "Dusting off the pitch deck",
  "Pinging the idea fairies", "Loading charisma", "Rolling the creative dice", "Spinning the idea wheel", "Pondering dramatically",
  "Squinting at the brief", "Flipping through ideas", "Sketching on the ceiling", "Reading the room", "Chasing a runaway thought",
  "Ironing out the wrinkles", "Remixing the brief", "Whisking up a reply", "Conjuring words", "Mixing colours",
  "Zooming in on the details", "Fact-checking my own hype", "Consulting the wedge", "Tickling the thesaurus", "Wrangling words",
  "Marinating on that", "Gift-wrapping an answer", "Dusting the crystal ball", "Tying a bow on it", "Doing a tiny victory dance",
  "Putting on my thinking cap", "Charging the idea battery", "Aligning the pixels", "Kerning my thoughts", "Warming up the pun engine",
  "Pitching to myself", "Cracking my knuckles", "Hunting the perfect word", "Plotting world domination, politely", "Rehearsing in the mirror",
  "Checking the vibes", "Waking up the muse", "Stirring the idea pot", "Following a hunch", "Tuning the hype meter",
  "Making it pop", "Adding a dash of chaos", "Rounding up the good ideas", "Sorting the loud from the louder", "Balancing on one brain cell",
  "Reading between the pixels", "Peeking into the future", "Catching a falling idea", "Painting the big picture", "Hatching a plan",
  "Digging through the idea vault", "Brewing something bold", "Sprinkling some magic", "Dreaming in hex codes", "Aligning the stars",
  "Untying a creative knot", "Taking a deep creative breath", "Thinking outside the box, then the other box", "Drafting a banger", "Tweaking the headline",
  "A/B testing my thoughts", "Staging a mini brainstorm", "Locking in the details", "Running the numbers", "Booting up the charm",
  "Trimming the fluff", "Punching up the copy", "Squeezing out the best idea", "Ping-ponging ideas", "Borrowing a bigger brain",
  "Rummaging through the idea drawer", "Inflating a big idea", "Rounding the corners", "Checking it twice", "Summoning the muse",
  "Choosing the loudest font", "Cueing the dramatic music", "Adjusting my bow tie", "Taking it to the whiteboard", "Mapping the plot",
] as const;

export const CHAT_LIMITS = { turns: 16, chars: 800 } as const;

export type ChatMessage = { role: "user" | "assistant"; content: string };
