import type { ScrollTrigger } from "./gsap";
import { getLenisInstance } from "./lenisInstance";

/**
 * Jumps past a pinned, scroll-scrubbed section — for visitors who'd rather
 * not scroll through the whole sequence. The pin's scroll range ends at
 * `trigger.end`; the next section starts one section-height below that,
 * once the pin-spacer has released.
 */
export function skipPastPin(trigger: ScrollTrigger | null | undefined, section: HTMLElement | null) {
  if (!trigger || !section) return;
  const target = trigger.end + section.offsetHeight;
  const lenis = getLenisInstance();
  if (lenis) lenis.scrollTo(target, { duration: 1.2 });
  else window.scrollTo({ top: target, behavior: "smooth" });
}
