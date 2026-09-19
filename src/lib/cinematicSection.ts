/**
 * A cinematic section's timeline lifecycle, driven entirely by the section
 * navigator now instead of its own ScrollTrigger. `run()` plays the
 * timeline once; once done, `isDone()` stays true forever — re-entering
 * the section (forward or backward) never replays it.
 */
export type CinematicController = {
  isDone: () => boolean;
  run: (onDone: () => void) => void;
  /**
   * A transient section is an interstitial: once its timeline has played the
   * navigator moves straight on to the next section, and — once that's
   * settled — calls `dismiss()` to take this one out of the page for good.
   */
  transient: boolean;
  dismiss: () => void;
};

type CinematicOptions = {
  /** Safety cap in case the timeline's onComplete never fires. */
  lockBufferMs?: number;
  /**
   * Also play the timeline once the section is mostly in view, even if the
   * section navigator never settled onto it — e.g. touch momentum scrolling
   * or a deep link carrying the page there natively. Without this, a
   * section that starts hidden stays blank when reached that way.
   */
  playWhenVisible?: boolean;
  /** Makes this an interstitial (see `CinematicController.transient`); `onDismiss` removes it from the layout. */
  transient?: { onDismiss: () => void };
};

const registry = new WeakMap<HTMLElement, CinematicController>();

/** Looks up the cinematic controller registered for a section's element, if any. */
export function getCinematicController(section: HTMLElement): CinematicController | null {
  return registry.get(section) ?? null;
}

/**
 * Registers a one-shot autonomous GSAP timeline against a section element
 * so the section navigator can play it once the section has settled into
 * the viewport. Mirrors the previous scroll-triggered behavior's contract:
 * `tl` is paused immediately, and once played to completion it's left in
 * its final state for good.
 */
export function registerCinematicSection(
  section: HTMLElement,
  tl: gsap.core.Timeline,
  { lockBufferMs = 1000, playWhenVisible = false, transient }: CinematicOptions = {}
) {
  tl.pause(0);

  // Loaded already past this section (refresh, deep link, back/forward
  // nav) — resolve to the finished state instead of animating a
  // transition the user never asked for.
  let done = section.getBoundingClientRect().bottom < 0;
  if (done) tl.progress(1);

  let failsafe: number | undefined;
  let playing = false;
  let waiting: Array<() => void> = [];

  const controller: CinematicController = {
    transient: Boolean(transient),
    dismiss: () => transient?.onDismiss(),
    isDone: () => done,
    run: (onDone) => {
      if (done) {
        onDone();
        return;
      }
      // Already playing (the in-view fallback got here first) — just wait
      // for that run instead of restarting it.
      waiting.push(onDone);
      if (playing) return;
      playing = true;
      const finish = () => {
        window.clearTimeout(failsafe);
        done = true;
        playing = false;
        const callbacks = waiting;
        waiting = [];
        callbacks.forEach((fn) => fn());
      };
      failsafe = window.setTimeout(finish, tl.duration() * 1000 + lockBufferMs);
      tl.eventCallback("onComplete", finish);
      tl.play(0);
    },
  };

  registry.set(section, controller);

  let observer: IntersectionObserver | undefined;
  if (playWhenVisible && !done && typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer?.disconnect();
        controller.run(() => {});
      },
      { threshold: 0.4 }
    );
    observer.observe(section);
  }

  return {
    cleanup: () => {
      observer?.disconnect();
      window.clearTimeout(failsafe);
      registry.delete(section);
    },
  };
}
