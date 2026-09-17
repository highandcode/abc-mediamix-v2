import type { ScrollTrigger } from "./gsap";

/**
 * Registry for scroll-scrubbed, pinned sections (e.g. Work's horizontal
 * gallery) that need continuous native scroll input rather than a single
 * settle-and-play cinematic. The section navigator lets scroll pass
 * through freely while parked on one of these, and only resumes discrete
 * section-to-section navigation once ScrollTrigger reports the pinned
 * range has been scrolled past (`onLeave`/`onLeaveBack`).
 */

type BoundaryDirection = "leave" | "leaveBack";
type BoundaryListener = (direction: BoundaryDirection) => void;

const triggers = new Map<string, ScrollTrigger>();
const listeners = new Map<string, Set<BoundaryListener>>();

export function registerScrubTrigger(id: string, trigger: ScrollTrigger) {
  triggers.set(id, trigger);
  return () => {
    triggers.delete(id);
  };
}

export function getScrubTrigger(id: string): ScrollTrigger | null {
  return triggers.get(id) ?? null;
}

export function notifyScrubBoundary(id: string, direction: BoundaryDirection) {
  listeners.get(id)?.forEach((fn) => fn(direction));
}

export function onScrubBoundary(id: string, fn: BoundaryListener) {
  if (!listeners.has(id)) listeners.set(id, new Set());
  listeners.get(id)!.add(fn);
  return () => {
    listeners.get(id)?.delete(fn);
  };
}
