/** Diwali mode: the floating orange asterisks on the landing screen become diyas, and a sparkler and a sutli bomb can be played with (components/Diwali.tsx). */
export const SHOW_DIWALI = true; // false = the normal landing page, nothing Diwali is rendered

export const DIWALI = {
  /** Diyas on the landing screen: centre as % of the screen, and width in px. */
  diyas: [
    { left: 9, top: 20, w: 78 },
    { left: 86, top: 24, w: 92 },
    { left: 20, top: 77, w: 84 },
    { left: 91, top: 72, w: 70 },
    { left: 68, top: 88, w: 78 },
  ],
  lightMs: 2600,      // how long the sparkler must be held at a wick before the diya catches
  fuseTouchMs: 900,   // how long it must touch the bomb's fuse
  fuseBurnMs: 2200,   // the fuse burns down over this long, then the bomb blasts
  memeMs: 7000,       // longest the "Happy Diwali" clip stays on screen
  video: "/diwali/jethalal.mp4", // drop the clip here; until it exists a plain "Happy Diwali" card is shown
} as const;
