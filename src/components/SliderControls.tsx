import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const EDGE_EPSILON = 4;
const AUTO_SPEED = 32; // px per second — a slow drift, not a marquee
const END_PAUSE_MS = 1400;
const TOUCH_RESUME_MS = 2500;

/**
 * Drives a horizontally scrollable track with prev/next buttons: one item
 * (plus its gap) per click, and edge flags so the buttons can hide at either end.
 * Items are found by `[data-slide]`.
 *
 * With `autoScroll`, the track also drifts slowly on its own, bouncing
 * between its two ends. It stops the moment the visitor engages — hovering
 * or focusing anywhere in the track's wrapper (which includes the arrows),
 * touching it, or scrolling it by hand — and picks up again once they let go.
 * The track's parent element is treated as that wrapper.
 */
export function useSliderTrack({ autoScroll = false }: { autoScroll?: boolean } = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      start: track.scrollLeft <= EDGE_EPSILON,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - EDGE_EPSILON,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    const wrapper = track?.parentElement;
    if (!autoScroll || reducedMotion || !track || !wrapper) return;

    let engaged = 0; // hover / focus / touch holds
    let resumeTimer: number | undefined;
    let visible = false;
    let raf = 0;
    let last = 0;
    let pos = track.scrollLeft;
    let lastSet = pos;
    let direction: 1 | -1 = 1;
    let pausedUntil = 0;

    const hold = () => {
      engaged++;
      window.clearTimeout(resumeTimer);
    };
    const release = (delay = 0) => {
      engaged = Math.max(0, engaged - 1);
      window.clearTimeout(resumeTimer);
      if (delay) {
        engaged++;
        resumeTimer = window.setTimeout(() => {
          engaged = Math.max(0, engaged - 1);
        }, delay);
      }
    };

    const onEnter = () => hold();
    const onLeave = () => release();
    // Only keyboard focus holds the drift — a mouse click on an arrow also
    // focuses it, and that shouldn't freeze the slider after the pointer leaves.
    let focusHeld = false;
    const onFocusIn = (e: FocusEvent) => {
      if (focusHeld || !(e.target instanceof HTMLElement) || !e.target.matches(":focus-visible")) return;
      focusHeld = true;
      hold();
    };
    const onFocusOut = () => {
      if (!focusHeld) return;
      focusHeld = false;
      release();
    };
    const onTouchStart = () => hold();
    const onTouchEnd = () => release(TOUCH_RESUME_MS);
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) pausedUntil = performance.now() + TOUCH_RESUME_MS;
    };

    wrapper.addEventListener("mouseenter", onEnter);
    wrapper.addEventListener("mouseleave", onLeave);
    wrapper.addEventListener("focusin", onFocusIn);
    wrapper.addEventListener("focusout", onFocusOut);
    wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
    wrapper.addEventListener("touchend", onTouchEnd, { passive: true });
    wrapper.addEventListener("touchcancel", onTouchEnd, { passive: true });
    wrapper.addEventListener("wheel", onWheel, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrapper);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - last, 64);
      last = now;

      const max = track.scrollWidth - track.clientWidth;
      if (!visible || engaged > 0 || document.hidden || now < pausedUntil || max <= 0) {
        pos = track.scrollLeft; // stay in sync with any manual movement
        lastSet = pos;
        return;
      }
      // Something else moved the track (arrow click, swipe momentum) — follow it.
      if (Math.abs(track.scrollLeft - lastSet) > 1.5) pos = track.scrollLeft;

      pos += direction * AUTO_SPEED * (dt / 1000);
      if (pos >= max || pos <= 0) {
        pos = Math.min(max, Math.max(0, pos));
        direction = direction === 1 ? -1 : 1;
        pausedUntil = now + END_PAUSE_MS;
      }
      track.scrollLeft = pos;
      lastSet = track.scrollLeft;
    };
    raf = requestAnimationFrame((t) => {
      last = t;
      tick(t);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer);
      io.disconnect();
      wrapper.removeEventListener("mouseenter", onEnter);
      wrapper.removeEventListener("mouseleave", onLeave);
      wrapper.removeEventListener("focusin", onFocusIn);
      wrapper.removeEventListener("focusout", onFocusOut);
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchend", onTouchEnd);
      wrapper.removeEventListener("touchcancel", onTouchEnd);
      wrapper.removeEventListener("wheel", onWheel);
    };
  }, [autoScroll, reducedMotion]);

  const slide = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector<HTMLElement>("[data-slide]");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = item ? item.offsetWidth + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return { trackRef, edges, updateEdges, slide };
}

type SliderButtonProps = {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  /** "light" for pale backgrounds (default), "dark" for navy ones. */
  tone?: "light" | "dark";
  className?: string;
};

export function SliderButton({ direction, disabled, onClick, tone = "light", className = "" }: SliderButtonProps) {
  const isPrev = direction === "prev";
  const toneClass =
    tone === "dark"
      ? "bg-ivory/90 text-navy hover:bg-gold hover:text-ivory"
      : "bg-paper/90 text-ink hover:bg-gold hover:text-ivory";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous" : "Next"}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full shadow-md backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 sm:h-12 sm:w-12 ${toneClass} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={isPrev ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
