/** Diwali mode: the floating orange asterisks on the landing screen become diyas, and a sparkler and a sutli bomb can be played with (components/Diwali.tsx). */
export const SHOW_DIWALI = true; // false = the normal landing page, nothing Diwali is rendered

export const DIWALI = {
  /** Diyas on the landing screen: centre as % of the screen, and width in px. `phone` is where it sits on small screens, or false to hide it there, so the landing page is not crowded. */
  diyas: ([
    { left: 9, top: 20, w: 78, phone: { left: 9, top: 20 } },
    { left: 86, top: 24, w: 92, phone: { left: 86, top: 24 } },
    { left: 20, top: 77, w: 84, phone: { left: 30, top: 87 } },
    { left: 91, top: 72, w: 70, phone: false },
    { left: 68, top: 88, w: 78, phone: false },
  ] as { left: number; top: number; w: number; phone: { left: number; top: number } | false }[]),
  lightMs: 2600,      // how long the sparkler must be held at a wick before the diya catches
  fuseTouchMs: 900,   // how long it must touch the bomb's fuse
  fuseBurnMs: 2200,   // the fuse burns down over this long, then the bomb blasts
  memeDelayMs: 1000,  // the clip starts this long after the blast
  memeMs: 7000,       // how long the plain "Happy Diwali" card stays if the clip is missing
  memeMaxMs: 45000,   // safety net: the clip plays to its end, then everything resets; this only matters if it stalls
  video: "/diwali/jethalal.mp4", // drop the clip here; until it exists a plain "Happy Diwali" card is shown
} as const;
