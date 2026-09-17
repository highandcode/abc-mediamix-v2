/**
 * A cinematic section's timeline lifecycle, driven entirely by the section
 * navigator now instead of its own ScrollTrigger. `run()` plays the
 * timeline once; once done, `isDone()` stays true forever — re-entering
 * the section (forward or backward) never replays it.
 */
export type CinematicController = {
  isDone: () => boolean;
  run: (onDone: () => void) => void;
};

type CinematicOptions = {
  /** Safety cap in case the timeline's onComplete never fires. */
  lockBufferMs?: number;
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
  { lockBufferMs = 1000 }: CinematicOptions = {}
) {
  tl.pause(0);

  // Loaded already past this section (refresh, deep link, back/forward
  // nav) — resolve to the finished state instead of animating a
  // transition the user never asked for.
  let done = section.getBoundingClientRect().bottom < 0;
  if (done) tl.progress(1);

  let failsafe: number | undefined;

  const controller: CinematicController = {
    isDone: () => done,
    run: (onDone) => {
      if (done) {
        onDone();
        return;
      }
      const finish = () => {
        window.clearTimeout(failsafe);
        done = true;
        onDone();
      };
      failsafe = window.setTimeout(finish, tl.duration() * 1000 + lockBufferMs);
      tl.eventCallback("onComplete", finish);
      tl.play(0);
    },
  };

  registry.set(section, controller);

  return {
    cleanup: () => {
      window.clearTimeout(failsafe);
      registry.delete(section);
    },
  };
}
