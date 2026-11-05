/**
 * Chatbot settings that the page needs (safe for the browser). The server-side prompt lives in lib/chatServer.ts.
 * The character is Wacky, file name Waz (components/Waz.tsx, designer's notes in public/waz-character.zip > WAZ.md).
 */
export const SHOW_CHATBOT = true; // false = no chat button on the website and /api/chat answers 404

export const CHATBOT = {
  name: "Wacky",
  role: "Wacko's chat bot",
  greeting: "Yo! I'm Wacky, Wacko's bot. Half creative director, half chaos. What are we making loud today?",
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

/**
 * Wacky starts conversations: while the chat is closed he waves, pulls a face and says something in a thought cloud above his
 * button. `pool` says which part of the page the visitor is looking at when the line fits ("any" fits everywhere), and
 * mood/move pick his expression and movement for it (see components/Waz.tsx).
 */
export type Attention = { say: string; mood: "happy" | "thinking" | "excited" | "confused" | "oops" | "wink"; move: "wave" | "talk" | "think" | "bounce" | "shake"; pool: "any" | "intro" | "services" | "clients" | "reels" | "book" | "faq" | "contact" };
export const ATTENTION: Attention[] = [
  // anywhere
  { say: "Psst! Over here. Yes, you!", mood: "happy", move: "wave", pool: "any" },
  { say: "Hi hi! Need a hand with anything?", mood: "happy", move: "wave", pool: "any" },
  { say: "Hello! Wave back, I dare you.", mood: "excited", move: "wave", pool: "any" },
  { say: "Ooh, a visitor! Let's make something loud.", mood: "excited", move: "bounce", pool: "any" },
  { say: "Big idea alert. Tell me yours!", mood: "excited", move: "bounce", pool: "any" },
  { say: "I can book your intro call in under a minute.", mood: "wink", move: "bounce", pool: "any" },
  { say: "Ask me anything. I only bite deadlines.", mood: "wink", move: "talk", pool: "any" },
  { say: "Hmm... what if your brand got louder?", mood: "thinking", move: "think", pool: "any" },
  { say: "Thinking about your next campaign...", mood: "thinking", move: "think", pool: "any" },
  { say: "Should I tell them about the AI stuff? Yes. Yes I should.", mood: "thinking", move: "think", pool: "any" },
  { say: "Still scrolling? I admire the dedication.", mood: "confused", move: "think", pool: "any" },
  { say: "Whoops, hope I'm not interrupting. Hi!", mood: "oops", move: "shake", pool: "any" },
  { say: "I speak English, Hinglish and Gujlish. Try me!", mood: "happy", move: "talk", pool: "any" },
  // by section
  { say: "Welcome to Wacko Studios! Look around, I'm right here.", mood: "happy", move: "wave", pool: "intro" },
  { say: "New here? I give the quick tour.", mood: "excited", move: "bounce", pool: "intro" },
  { say: "Eleven services. Tap me and I'll pick one for you.", mood: "excited", move: "bounce", pool: "services" },
  { say: "Not sure which service you need? Neither am I. Let's chat!", mood: "confused", move: "think", pool: "services" },
  { say: "Reels, ads, AI, websites... choose your chaos.", mood: "wink", move: "talk", pool: "services" },
  { say: "Nice logos, right? Want yours up there?", mood: "wink", move: "bounce", pool: "clients" },
  { say: "Hmm, which of these brands is your favourite?", mood: "thinking", move: "think", pool: "clients" },
  { say: "Thumbs stopped. Mine too. Want yours to?", mood: "excited", move: "bounce", pool: "reels" },
  { say: "Cool reels, huh? Ours could be next to them.", mood: "wink", move: "talk", pool: "reels" },
  { say: "Want me to book that call? Takes 30 seconds.", mood: "excited", move: "bounce", pool: "book" },
  { say: "Stuck on the date? Tell me and I'll sort it.", mood: "happy", move: "talk", pool: "book" },
  { say: "I can fill this in for you. Just chat to me!", mood: "wink", move: "wave", pool: "book" },
  { say: "Got a question? I know the answers. Mostly.", mood: "happy", move: "talk", pool: "faq" },
  { say: "Can't find your question? Ask me instead!", mood: "confused", move: "think", pool: "faq" },
  { say: "Leaving already? One quick question first!", mood: "oops", move: "shake", pool: "contact" },
  { say: "Message us, or just chat with me. I'm faster.", mood: "wink", move: "wave", pool: "contact" },
];
export const ATTENTION_MAX_PER_VISIT = 10; // after this many cloud messages he stays quiet until the next visit

export const CHAT_LIMITS = { turns: 16, chars: 800 } as const;

export type ChatMessage = { role: "user" | "assistant"; content: string };
