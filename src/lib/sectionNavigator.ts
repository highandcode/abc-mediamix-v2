import { onLenisReady } from "./lenisInstance";
import { getCinematicController } from "./cinematicSection";
import { getScrubTrigger, onScrubBoundary } from "./scrubSection";
import { ScrollTrigger } from "./gsap";
import type Lenis from "lenis";

/**
 * Turns "the user scrolled" into "move the main frame to the next/previous
 * section" instead of "move the document by another N pixels" — see the
 * V2 scroll architecture brief. One frame is active at a time; while it's
 * settling in or playing its cinematic timeline, further scroll intent is
 * swallowed rather than queued, so aggressive scrolling never skips a
 * section or fires a second transition the instant the first unlocks.
 *
 * A frame is one of:
 *  - "fit"      section fits within the viewport — settle, play its
 *               cinematic if any, unlock. One gesture in, one gesture out.
 *  - "overflow" section is taller than the viewport (small screens, long
 *               copy) — settle to its near edge, then let scroll pass
 *               through its own content until the far edge is reached.
 *  - "scrub"    section owns a pinned/scrubbed ScrollTrigger (e.g. Work's
 *               horizontal gallery) — same passthrough idea, but the
 *               boundary is reported by ScrollTrigger's onLeave/onLeaveBack
 *               rather than measured directly.
 */

export type NavState = "idle" | "navigating" | "settling" | "animating" | "ready";
type FrameKind = "fit" | "overflow" | "scrub";
type Direction = "forward" | "backward";

type Frame = {
  id: string;
  index: number;
  element: HTMLElement;
  kind: FrameKind;
};

export type NavigatorSnapshot = {
  currentIndex: number;
  totalFrames: number;
  frameId: string | null;
  kind: FrameKind | null;
  state: NavState;
  locked: boolean;
  completed: boolean;
};

const OVERFLOW_EPSILON = 8;
const EXIT_EPSILON = 6;
const GESTURE_IDLE_MS = 140;
const WHEEL_ARM_THRESHOLD = 4;
const SETTLE_DURATION = 0.7;
const KEY_NUDGE_RATIO = 0.85;

// Elements that own the arrow / page keys (typing, picking an option).
const TEXT_ENTRY_SELECTOR = "input, textarea, select, [contenteditable]";
// Elements that also own Space (it activates them).
const INTERACTIVE_SELECTOR = `${TEXT_ENTRY_SELECTOR}, button, a[href], [role='button']`;

export class SectionNavigator {
  private frames: Frame[] = [];
  private currentIndex = 0;
  private state: NavState = "idle";
  private lenis: Lenis | null = null;

  private gestureActive = false;
  private gestureIdleTimer: number | undefined;

  private passthroughUnsub: (() => void) | null = null;
  private passthroughActive = false;
  private unsubscribers: Array<() => void> = [];
  private resizeTimer: number | undefined;
  private destroyed = false;

  private snapshotListeners = new Set<(snapshot: NavigatorSnapshot) => void>();

  private ids: string[];
  private readonly auto: boolean;

  /**
   * `ids` names the frames explicitly (the homepage). With `null`, every
   * `[data-frame]` element inside <main> is a frame, in document order — how
   * the inner pages opt in without keeping a list in sync.
   */
  constructor(ids: string[] | null = null) {
    this.auto = ids === null;
    this.ids = ids ?? [];
  }

  start() {
    const unsubReady = onLenisReady((lenis) => {
      if (this.destroyed) return;
      this.lenis = lenis;
      this.measure();
      if (this.frames.length === 0) return;
      this.attachInput(lenis);
      // Usually the page opens at the top, but a reload (or dev hot-reload)
      // can leave the browser scrolled part-way down — start from whichever
      // frame is actually on screen instead of assuming the first.
      this.settleImmediately(this.frames[Math.max(0, this.frameAtViewportCenter())]);
    });
    this.unsubscribers.push(unsubReady);

    window.addEventListener("resize", this.onResize);
    this.unsubscribers.push(() => window.removeEventListener("resize", this.onResize));

    window.addEventListener("load", this.onLoad);
    this.unsubscribers.push(() => window.removeEventListener("load", this.onLoad));

    document.fonts?.ready.then(() => {
      if (!this.destroyed) this.remeasureKinds();
    });
  }

  destroy() {
    this.destroyed = true;
    this.leavePassthrough();
    window.clearTimeout(this.gestureIdleTimer);
    window.clearTimeout(this.resizeTimer);
    this.unsubscribers.forEach((fn) => fn());
    this.unsubscribers = [];
    this.snapshotListeners.clear();
    this.lenis?.start();
  }

  subscribe(fn: (snapshot: NavigatorSnapshot) => void) {
    this.snapshotListeners.add(fn);
    fn(this.snapshot());
    return () => this.snapshotListeners.delete(fn);
  }

  // ---- setup -------------------------------------------------------------

  private measure() {
    let candidates: Array<{ id: string; element: HTMLElement | null }>;
    if (this.auto) {
      candidates = Array.from(document.querySelectorAll<HTMLElement>("main [data-frame]")).map((element, i) => ({
        id: element.id || `frame-${i}`,
        element,
      }));
      this.ids = candidates.map((c) => c.id);
    } else {
      candidates = this.ids.map((id) => ({ id, element: document.getElementById(id) }));
    }

    this.frames = candidates
      // A section that's been dismissed (or hidden for any other reason)
      // has no box — it isn't a frame anymore.
      .filter((c): c is { id: string; element: HTMLElement } => Boolean(c.element) && c.element!.getBoundingClientRect().height > 0)
      .map(({ id, element }, index) => ({
        id,
        index,
        element,
        kind: this.classify(element),
      }));
  }

  private classify(element: HTMLElement): FrameKind {
    if (getScrubTrigger(element.id)) return "scrub";
    const height = element.getBoundingClientRect().height;
    return height > window.innerHeight + OVERFLOW_EPSILON ? "overflow" : "fit";
  }

  private remeasureKinds() {
    if (this.state !== "ready") return;
    this.frames = this.frames.map((frame) => ({ ...frame, kind: this.classify(frame.element) }));
  }

  private onResize = () => {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.remeasureKinds(), 200);
  };

  private onLoad = () => this.remeasureKinds();

  /** Index of the frame covering the middle of the viewport, or -1 (e.g. over the footer). */
  private frameAtViewportCenter() {
    const mid = window.innerHeight / 2;
    return this.frames.findIndex((f) => {
      const rect = f.element.getBoundingClientRect();
      return rect.top <= mid && rect.bottom > mid;
    });
  }

  /**
   * Re-anchors the bookkeeping to what's actually on screen. The page can
   * end up somewhere the navigator didn't put it (scrollbar drag, restored
   * scroll position, layout shifting under it); without this, "previous" and
   * "next" would be relative to a frame the visitor isn't looking at.
   */
  private syncToViewport() {
    const index = this.frameAtViewportCenter();
    if (index !== -1 && index !== this.currentIndex) {
      this.currentIndex = index;
      this.emitSnapshot();
    }
  }

  /** Resolves the resting frame without any scroll motion. */
  private settleImmediately(frame: Frame) {
    this.currentIndex = frame.index;
    this.alignToFrame(frame);
    this.afterSettle(frame);
  }

  /**
   * A "fit" frame is meant to sit exactly on screen. If the page was left
   * between frames (a navigator restart mid-transition, a scrollbar drag),
   * snap it into place so there's a clean frame to scroll up or down from.
   */
  private alignToFrame(frame: Frame) {
    if (frame.kind !== "fit") return;
    if (Math.abs(frame.element.getBoundingClientRect().top) <= EXIT_EPSILON) return;
    this.lenis?.scrollTo(frame.element, { immediate: true, force: true });
  }

  // ---- input ---------------------------------------------------------------

  private attachInput(lenis: Lenis) {
    const offScroll = lenis.on("virtual-scroll", this.onVirtualScroll);
    this.unsubscribers.push(offScroll);

    window.addEventListener("keydown", this.onKeydown);
    this.unsubscribers.push(() => window.removeEventListener("keydown", this.onKeydown));
  }

  private onVirtualScroll = ({ deltaY }: { deltaY: number }) => {
    if (deltaY === 0) return;

    window.clearTimeout(this.gestureIdleTimer);
    this.gestureIdleTimer = window.setTimeout(() => {
      this.gestureActive = false;
    }, GESTURE_IDLE_MS);

    // Already mid-gesture (decided or still ramping up) — this event just
    // keeps the gesture alive, it never arms a second navigation.
    if (this.gestureActive) return;
    if (Math.abs(deltaY) < WHEEL_ARM_THRESHOLD) return;

    this.gestureActive = true;

    // Parked on a scrub/overflow frame — or past the last frame, into the
    // footer — that's actively passing scroll through to Lenis natively:
    // let it keep driving that native scroll instead of hijacking the
    // gesture into a discrete section jump. Only the boundary callback is
    // allowed to advance the index while in this mode.
    if (this.passthroughActive && this.state === "ready") return;

    this.navigate(deltaY > 0 ? "forward" : "backward");
  };

  private onKeydown = (e: KeyboardEvent) => {
    // After a click, focus stays on the button or link that was pressed. Space
    // must still activate it, but the arrow / page keys have no job there —
    // and if the navigator ignored them the browser would scroll the page
    // natively and leave the frame off its mark.
    if (this.isInteractiveTarget(e.target, e.key === " ")) return;

    let direction: Direction | null = null;
    if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) direction = "forward";
    else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) direction = "backward";
    if (!direction) return;

    e.preventDefault();

    if (this.passthroughActive && this.state === "ready") {
      this.nudge(direction);
      return;
    }
    this.navigate(direction);
  };

  private isInteractiveTarget(target: EventTarget | null, isSpace: boolean) {
    return (
      target instanceof HTMLElement && Boolean(target.closest(isSpace ? INTERACTIVE_SELECTOR : TEXT_ENTRY_SELECTOR))
    );
  }

  private nudge(direction: Direction) {
    const lenis = this.lenis;
    if (!lenis) return;
    const amount = window.innerHeight * KEY_NUDGE_RATIO * (direction === "forward" ? 1 : -1);
    lenis.scrollTo(lenis.scroll + amount, { duration: 0.6 });
  }

  // ---- state machine ---------------------------------------------------

  private navigate(direction: Direction) {
    if (this.state !== "ready") return;
    this.syncToViewport();
    const targetIndex = this.currentIndex + (direction === "forward" ? 1 : -1);
    if (targetIndex < 0) {
      // Nothing above the first frame — but if the page has drifted off it,
      // bring it back rather than appearing to ignore the gesture.
      const first = this.frames[this.currentIndex];
      if (first && first.kind === "fit" && Math.abs(first.element.getBoundingClientRect().top) > EXIT_EPSILON) {
        this.enterFrame(this.currentIndex, direction);
      }
      return;
    }
    if (targetIndex >= this.frames.length) {
      // Nothing past the last frame but the page's own trailing content
      // (the footer) — release Lenis so it's reachable by ordinary
      // scrolling instead of leaving the user stuck locked on the last
      // section forever.
      if (direction === "forward") this.enterTailPassthrough();
      return;
    }
    this.leavePassthrough();
    this.enterFrame(targetIndex, direction);
  }

  /**
   * Explicit click-driven navigation (a nav link, a "scroll to next"
   * button) rather than a wheel/touch gesture — so, unlike `navigate()`,
   * this is allowed to jump more than one frame at a time. Keeps
   * `currentIndex` in sync so a subsequent scroll gesture picks up from
   * the right place instead of the wheel-gesture bookkeeping going stale.
   */
  goToId(id: string) {
    if (this.state !== "ready") return;
    this.syncToViewport();
    // A dismissed interstitial resolves to whichever frame took its place.
    const wanted = this.ids.indexOf(id);
    const targetIndex = wanted === -1 ? -1 : this.frames.findIndex((f) => this.ids.indexOf(f.id) >= wanted);
    this.goToFrame(targetIndex);
  }

  /** Same as `goToId`, addressing the frame by position (progress dots). */
  goToIndex(index: number) {
    if (this.state !== "ready") return;
    this.syncToViewport();
    this.goToFrame(index);
  }

  private goToFrame(targetIndex: number) {
    if (targetIndex < 0 || targetIndex >= this.frames.length || targetIndex === this.currentIndex) return;
    const direction: Direction = targetIndex > this.currentIndex ? "forward" : "backward";
    this.leavePassthrough();
    this.lenis?.stop();
    this.enterFrame(targetIndex, direction);
  }

  private navigateFromBoundary(direction: Direction) {
    if (this.state !== "ready") return;
    const targetIndex = this.currentIndex + (direction === "forward" ? 1 : -1);
    this.leavePassthrough();
    this.lenis?.stop();
    if (targetIndex < 0 || targetIndex >= this.frames.length) {
      this.setState("ready");
      return;
    }
    this.enterFrame(targetIndex, direction);
  }

  private enterFrame(index: number, direction: Direction) {
    const frame = this.frames[index];
    if (!frame) return;
    this.currentIndex = index;
    this.setState("navigating");
    const target = this.resolveTarget(frame, direction);
    this.moveTo(target, () => this.afterSettle(frame));
  }

  private resolveTarget(frame: Frame, direction: Direction): HTMLElement | number {
    if (frame.kind === "scrub") {
      const trigger = getScrubTrigger(frame.id);
      if (direction === "backward" && trigger) return trigger.end;
      return frame.element;
    }
    if (frame.kind === "overflow" && direction === "backward") {
      const rect = frame.element.getBoundingClientRect();
      return window.scrollY + rect.bottom - window.innerHeight;
    }
    return frame.element;
  }

  private moveTo(target: HTMLElement | number, onDone: () => void) {
    const lenis = this.lenis;
    if (!lenis) {
      if (typeof target === "number") window.scrollTo({ top: target, behavior: "auto" });
      else target.scrollIntoView({ behavior: "auto", block: "start" });
      requestAnimationFrame(onDone);
      return;
    }
    lenis.stop();
    lenis.scrollTo(target, {
      duration: SETTLE_DURATION,
      lock: true,
      force: true,
      onComplete: () => {
        lenis.stop();
        onDone();
      },
    });
  }

  private afterSettle(frame: Frame) {
    this.setState("settling");
    const cinematic = getCinematicController(frame.element);
    if (cinematic && !cinematic.isDone()) {
      this.setState("animating");
      cinematic.run(() => this.afterAnimate(frame));
    } else {
      this.afterAnimate(frame);
    }
  }

  private afterAnimate(frame: Frame) {
    this.dismissTransientBehind();

    if (frame.kind === "fit") {
      this.lenis?.stop();
      this.setState("ready");
      // An interstitial has said its piece — hand off to the next section
      // without waiting for another gesture.
      if (getCinematicController(frame.element)?.transient) this.navigate("forward");
      return;
    }
    this.lenis?.start();
    this.setState("ready");
    this.enterPassthrough(frame);
  }

  /**
   * Removes finished interstitials that now sit behind the current frame:
   * hides them, drops them from the frame list, and re-pins the scroll
   * position to the current frame (collapsing a section above shifts
   * everything below it up).
   */
  private dismissTransientBehind() {
    const current = this.frames[this.currentIndex];
    if (!current) return;
    const gone = this.frames.filter((f) => {
      if (f.index >= this.currentIndex) return false;
      const c = getCinematicController(f.element);
      return Boolean(c?.transient && c.isDone());
    });
    if (gone.length === 0) return;

    gone.forEach((f) => getCinematicController(f.element)?.dismiss());
    this.frames = this.frames
      .filter((f) => !gone.includes(f))
      .map((f, index) => ({ ...f, index }));
    this.currentIndex = this.frames.findIndex((f) => f.element === current.element);

    this.lenis?.resize();
    this.lenis?.scrollTo(current.element, { immediate: true, force: true });
    ScrollTrigger.refresh();
  }

  private enterPassthrough(frame: Frame) {
    this.leavePassthrough();
    this.passthroughActive = true;

    if (frame.kind === "scrub") {
      this.passthroughUnsub = onScrubBoundary(frame.id, (direction) => {
        if (this.currentIndex !== frame.index) return;
        this.navigateFromBoundary(direction === "leave" ? "forward" : "backward");
      });
      return;
    }

    if (frame.kind === "overflow") {
      const lenis = this.lenis;
      if (!lenis) return;
      const check = () => {
        if (this.currentIndex !== frame.index || this.state !== "ready") return;
        const rect = frame.element.getBoundingClientRect();
        if (rect.bottom < window.innerHeight - EXIT_EPSILON) {
          this.navigateFromBoundary("forward");
        } else if (rect.top > EXIT_EPSILON) {
          this.navigateFromBoundary("backward");
        }
      };
      this.passthroughUnsub = lenis.on("scroll", check);
    }
  }

  /**
   * Past the last frame there's no next section to hand off to — just the
   * page's own trailing content (the footer). Release Lenis so it scrolls
   * there normally, and watch for the user scrolling back up past the
   * last frame's top to re-engage discrete pagination.
   */
  private enterTailPassthrough() {
    const lenis = this.lenis;
    if (!lenis) return;
    const lastFrame = this.frames[this.frames.length - 1];
    if (!lastFrame) return;

    this.leavePassthrough();
    this.passthroughActive = true;
    lenis.start();

    this.passthroughUnsub = lenis.on("scroll", () => {
      if (this.currentIndex !== lastFrame.index || this.state !== "ready") return;
      const rect = lastFrame.element.getBoundingClientRect();
      if (rect.top > EXIT_EPSILON) {
        this.navigateFromBoundary("backward");
      }
    });
  }

  private leavePassthrough() {
    this.passthroughUnsub?.();
    this.passthroughUnsub = null;
    this.passthroughActive = false;
  }

  private setState(state: NavState) {
    this.state = state;
    this.emitSnapshot();
  }

  private emitSnapshot() {
    if (this.snapshotListeners.size === 0) return;
    const snapshot = this.snapshot();
    this.snapshotListeners.forEach((fn) => fn(snapshot));
  }

  private snapshot(): NavigatorSnapshot {
    const frame = this.frames[this.currentIndex];
    const cinematic = frame ? getCinematicController(frame.element) : null;
    return {
      currentIndex: this.currentIndex,
      totalFrames: this.frames.length,
      frameId: frame?.id ?? null,
      kind: frame?.kind ?? null,
      state: this.state,
      locked: this.state !== "ready" && this.state !== "idle",
      completed: cinematic?.isDone() ?? false,
    };
  }
}

// Only one page (and therefore one navigator) is ever mounted at a time.
// Exposing it as a singleton lets existing click-driven affordances
// elsewhere (the navbar logo, Hero's "scroll to next" button, the frame
// progress dots) hand off to it instead of scrolling straight through
// Lenis, which would desync the navigator's frame bookkeeping — or simply
// get swallowed while a section is locked/mid-cinematic.
let activeNavigator: SectionNavigator | null = null;
let activeUnsubscribe: (() => void) | null = null;
let latestSnapshot: NavigatorSnapshot | null = null;
const storeListeners = new Set<() => void>();

function notifyStore() {
  storeListeners.forEach((fn) => fn());
}

export function setActiveSectionNavigator(navigator: SectionNavigator | null) {
  activeUnsubscribe?.();
  activeUnsubscribe = null;
  activeNavigator = navigator;
  latestSnapshot = null;
  if (navigator) {
    activeUnsubscribe = navigator.subscribe((snapshot) => {
      latestSnapshot = snapshot;
      notifyStore();
    });
  } else {
    notifyStore();
  }
}

/** External-store plumbing for `useSyncExternalStore` (see useFrameSnapshot). */
export function subscribeToActiveNavigator(fn: () => void) {
  storeListeners.add(fn);
  return () => {
    storeListeners.delete(fn);
  };
}

export function getActiveNavigatorSnapshot() {
  return latestSnapshot;
}

/** Returns true if an active navigator handled (or is handling) the request. */
export function requestSectionById(id: string): boolean {
  if (!activeNavigator) return false;
  activeNavigator.goToId(id);
  return true;
}

export function requestFrameIndex(index: number): boolean {
  if (!activeNavigator) return false;
  activeNavigator.goToIndex(index);
  return true;
}
