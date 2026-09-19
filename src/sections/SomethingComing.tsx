import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { registerCinematicSection } from "../lib/cinematicSection";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "../hooks/useReducedMotion";

const LABEL = "Something is coming…";
const RING_CIRCUMFERENCE = 2 * Math.PI * 26;

// An interstitial, not a destination: it plays once per visit and is then
// taken out of the page. Remounting Home (navigating away and back) must
// not bring it back, so the "already shown" flag outlives the component.
let shownThisVisit = false;

export default function SomethingComing() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ringWrapRef = useRef<SVGSVGElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const reducedMotion = useReducedMotion();

  // Layout effect so it's already gone before the section navigator
  // measures its frames.
  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !shownThisVisit) return;
    const section = sectionRef.current;
    if (section) section.style.display = "none";
  }, [reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    const ringWrap = ringWrapRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const chars = charRefs.current.filter((el): el is HTMLSpanElement => el !== null);
    if (reducedMotion || shownThisVisit || !section || !label || !ringWrap || !ring || !dot) return;

    gsap.set(chars, { opacity: 0, y: 10 });
    gsap.set(label, { letterSpacing: "0.75em" });
    gsap.set(ring, { strokeDasharray: RING_CIRCUMFERENCE, strokeDashoffset: RING_CIRCUMFERENCE });
    gsap.set(dot, { scale: 0, transformOrigin: "50% 50%" });

    let cinematic: ReturnType<typeof registerCinematicSection> | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      // 1. the ring draws itself in around a point of light, and the line
      //    fades in letter by letter as its tracking tightens
      tl.fromTo(ringWrap, { rotation: -140 }, { rotation: 0, duration: 1.6, ease: "power2.out" }, 0)
        .to(ring, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, 0)
        .to(dot, { scale: 1, duration: 0.5, ease: "back.out(2.5)" }, 0.35)
        .to(chars, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.045 }, 0.5)
        .to(label, { letterSpacing: "0.4em", duration: 1.8, ease: "power2.out" }, 0.5)
        // 2. a beat to read it
        // 3. the ring opens outward like a portal and the line dissolves;
        //    the next section is the same navy, so it reads as one move
        .set(ring, { strokeDasharray: "none" }, 2.5)
        .to(chars, { opacity: 0, y: -8, duration: 0.45, ease: "power1.in", stagger: 0.015 }, 2.4)
        .to(dot, { scale: 0, duration: 0.35, ease: "power2.in" }, 2.45)
        .to(ring, { attr: { r: 620 }, opacity: 0, duration: 1, ease: "power3.in" }, 2.5);

      cinematic = registerCinematicSection(section, tl, {
        transient: {
          onDismiss: () => {
            shownThisVisit = true;
            section.style.display = "none";
          },
        },
      });
    }, section);

    return () => {
      cinematic?.cleanup();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="something-coming"
      ref={sectionRef}
      className="relative flex h-[100svh] flex-col items-center justify-center gap-8 overflow-hidden bg-navy px-6 text-center"
    >
      <p
        ref={labelRef}
        aria-label={LABEL}
        className="font-display text-[11px] font-semibold uppercase tracking-[0.4em] text-ivory/70"
      >
        {LABEL.split("").map((char, i) => (
          <span
            key={i}
            aria-hidden="true"
            ref={(el) => {
              charRefs.current[i] = el;
            }}
            className="inline-block whitespace-pre"
          >
            {char}
          </span>
        ))}
      </p>

      <svg
        ref={ringWrapRef}
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        className="overflow-visible"
        aria-hidden="true"
      >
        <circle
          ref={ringRef}
          cx="36"
          cy="36"
          r="26"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={reducedMotion ? "120 100" : undefined}
        />
        <circle ref={dotRef} cx="36" cy="36" r="2.5" fill="var(--color-gold)" />
      </svg>
    </section>
  );
}
