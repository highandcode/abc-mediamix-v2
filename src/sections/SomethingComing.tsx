import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function SomethingComing() {
  const ringRef = useRef<SVGCircleElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ringRef.current) return;
    const tween = gsap.to(ringRef.current, {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 6,
      repeat: -1,
      ease: "none",
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  return (
    <section
      id="something-coming"
      className="relative flex min-h-[50vh] flex-col items-center justify-center gap-8 bg-navy px-6 py-24 text-center"
    >
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.4em] text-ivory/70">
        Something is coming&hellip;
      </p>

      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle
          ref={ringRef}
          cx="36"
          cy="36"
          r="26"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          strokeDasharray="120 100"
          strokeLinecap="round"
        />
        <circle cx="36" cy="36" r="2.5" fill="var(--color-gold)" />
      </svg>
    </section>
  );
}
