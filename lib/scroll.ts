export function goTo(sel: string) {
  const el = document.querySelector(sel);
  if (!el) return;
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + scrollY), behavior: rm ? "auto" : "smooth" });
}
