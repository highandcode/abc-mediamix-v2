import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { workItems } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { registerScrubTrigger, notifyScrubBoundary } from "../lib/scrubSection";

const SCRUB_ID = "work";

const PANEL_STYLES = [
  "linear-gradient(150deg,#262970 0%,#1a1c4a 100%)",
  "linear-gradient(150deg,#9f732c 0%,#4a3a1f 100%)",
  "linear-gradient(150deg,#ece6d9 0%,#c7bda3 100%)",
  "linear-gradient(150deg,#3e3e3e 0%,#5a5a5a 100%)",
  "linear-gradient(150deg,#c79a5c 0%,#262970 100%)",
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let unregisterScrub: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const scrollLength = () => Math.max(track.scrollWidth - window.innerWidth, 0);

      const tween = gsap.to(track, {
        x: () => -scrollLength(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + scrollLength(),
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          // The section navigator lets scroll pass through freely while
          // this gallery is scrubbing; these boundary callbacks are its
          // signal to hand off to discrete section-to-section navigation.
          onLeave: () => notifyScrubBoundary(SCRUB_ID, "leave"),
          onLeaveBack: () => notifyScrubBoundary(SCRUB_ID, "leaveBack"),
        },
      });

      if (tween.scrollTrigger) unregisterScrub = registerScrubTrigger(SCRUB_ID, tween.scrollTrigger);
    }, section);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      unregisterScrub?.();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative overflow-hidden bg-ivory py-24 lg:py-0"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-gold">CURIOUS?</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            See how we turn ideas into impact.
          </h2>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`mt-12 flex gap-6 px-6 lg:mt-16 lg:h-[62vh] lg:flex-nowrap lg:px-12 ${
          reducedMotion ? "flex-wrap" : "w-max flex-nowrap"
        }`}
      >
        {workItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex((cur) => (cur === i ? null : i))}
            className="group relative h-[70vw] max-h-[440px] w-[82vw] max-w-[420px] shrink-0 overflow-hidden rounded-2xl text-left shadow-[0_30px_60px_-30px_rgba(62,62,62,0.4)] sm:h-[440px] sm:w-[380px] lg:h-full lg:w-[420px]"
            style={{ background: PANEL_STYLES[i % PANEL_STYLES.length] }}
          >
            <span
              className={`absolute right-6 top-6 font-display text-6xl font-extrabold opacity-30 ${
                i === 2 ? "text-ink" : "text-ivory"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-7">
              <h3
                className={`font-display text-xl font-bold leading-snug sm:text-2xl ${
                  i === 2 ? "text-ink" : "text-ivory"
                }`}
              >
                {item.title}
              </h3>

              <div
                className={`grid transition-all duration-500 ${
                  activeIndex === i ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0 group-hover:mt-4 group-hover:grid-rows-[1fr] group-hover:opacity-100"
                }`}
              >
                <div className="overflow-hidden">
                  <p className={`text-sm ${i === 2 ? "text-ink-soft" : "text-ivory/70"}`}>{item.teaser}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.mediums.map((m) => (
                      <span
                        key={m}
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide-label ${
                          i === 2
                            ? "border-ink/20 text-ink-soft"
                            : "border-ivory/25 text-ivory/80"
                        }`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide-label ${
                      i === 2 ? "text-gold" : "text-gold-pale"
                    }`}
                  >
                    View the story <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}

        <div className="flex h-[70vw] max-h-[440px] w-[60vw] max-w-[260px] shrink-0 items-center justify-center sm:h-[440px] lg:h-full">
          <span className="text-sm text-ink-soft">More stories, always in motion.</span>
        </div>
      </div>
    </section>
  );
}
