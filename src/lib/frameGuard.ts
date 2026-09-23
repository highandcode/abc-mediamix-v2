/**
 * Frames clip whatever doesn't fit (`overflow: hidden`), so a frame that's
 * too tall for a small screen silently loses content. This measures every
 * `[data-frame]` and reports the ones whose content leaves the frame's
 * content box (below the navbar, above the bottom padding).
 *
 * `scrollHeight` can't be used: frames centre their content, and overflow
 * off the *top* of a centred flex box is never counted as scrollable. So each
 * descendant's own box is compared instead. Out-of-flow decoration (absolute
 * or fixed) and anything already clipped or scrolled by an inner container
 * (a slider track) is skipped, and transforms are switched off while
 * measuring — an off-screen reveal is parked a few px low.
 */

export type FrameOverflow = {
  frame: string;
  /** px of content beyond the top / bottom / sides of the content box. */
  top: number;
  bottom: number;
  x: number;
  /** The element that sticks out furthest, for tracking it down. */
  culprit: string;
};

const TOLERANCE = 2;

function isMeasured(el: HTMLElement, frame: HTMLElement) {
  // An inline box is taller than its line (font ascent + descent), so it can
  // poke past its block by a few px without anything being cut off.
  if (getComputedStyle(el).display === "inline") return false;
  for (let node: HTMLElement | null = el; node && node !== frame; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.position === "absolute" || style.position === "fixed") return false;
    if (node !== el && (style.overflowX !== "visible" || style.overflowY !== "visible")) return false;
    if (style.display === "none" || style.visibility === "hidden") return false;
  }
  return true;
}

export function auditFrames(): FrameOverflow[] {
  const frames = Array.from(document.querySelectorAll<HTMLElement>("main [data-frame]"));
  const root = document.documentElement;
  root.classList.add("frame-audit");
  try {
    const results: FrameOverflow[] = [];
    frames.forEach((frame, i) => {
      const box = frame.getBoundingClientRect();
      const style = getComputedStyle(frame);
      const limitTop = box.top + parseFloat(style.paddingTop);
      const limitBottom = box.bottom - parseFloat(style.paddingBottom);
      let top = 0;
      let bottom = 0;
      let x = 0;
      let worst = 0;
      let culprit = "";
      frame.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0 || !isMeasured(el, frame)) return;
        const over = [limitTop - rect.top, rect.bottom - limitBottom, rect.right - box.right, box.left - rect.left];
        top = Math.max(top, over[0]);
        bottom = Math.max(bottom, over[1]);
        x = Math.max(x, over[2], over[3]);
        const max = Math.max(...over);
        if (max > worst) {
          worst = max;
          culprit = `<${el.tagName.toLowerCase()} class="${el.className.toString().slice(0, 60)}"> ${(el.textContent ?? "").trim().slice(0, 24)}`;
        }
      });
      if (top > TOLERANCE || bottom > TOLERANCE || x > TOLERANCE) {
        results.push({
          frame: frame.id || `frame-${i}`,
          top: Math.round(Math.max(0, top)),
          bottom: Math.round(Math.max(0, bottom)),
          x: Math.round(Math.max(0, x)),
          culprit,
        });
      }
    });
    return results;
  } finally {
    root.classList.remove("frame-audit");
  }
}

/**
 * Development-only: audits shortly after mount and again after resizes and
 * font loads, logging a warning for each frame that doesn't fit. Returns a
 * cleanup function.
 */
export function startFrameAudit() {
  let timer: number | undefined;
  const run = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const bad = auditFrames();
      if (bad.length === 0) return;
      console.warn(
        `[frames] ${bad.length} frame(s) don't fit the ${window.innerWidth}x${window.innerHeight} viewport:`,
        bad
      );
    }, 500);
  };

  (window as unknown as { __auditFrames?: typeof auditFrames }).__auditFrames = auditFrames;
  run();
  window.addEventListener("resize", run);
  document.fonts?.ready.then(run);

  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("resize", run);
  };
}
