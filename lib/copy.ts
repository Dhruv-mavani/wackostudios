/** Copies text and returns the label to flash on the button. */
export async function copyText(txt: string): Promise<string> {
  let ok = false;
  try { await navigator.clipboard.writeText(txt); ok = true; } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = txt; ta.style.cssText = "position:fixed;opacity:0;left:0;top:0";
      document.body.appendChild(ta); ta.select(); ok = document.execCommand("copy"); ta.remove();
    } catch { /* fall through */ }
  }
  return ok ? "Copied" : "Select and copy";
}
