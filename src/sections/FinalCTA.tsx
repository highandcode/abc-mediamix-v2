import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { registerCinematicSection } from "../lib/cinematicSection";
import { infinityPath, prepareDraw } from "../lib/paths";
import { useReducedMotion } from "../hooks/useReducedMotion";

const D = infinityPath(150, 60, 160, 60, 100);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    const content = contentRef.current;
    if (!section || !path || !content) return;

    if (reducedMotion) {
      gsap.set(content, { opacity: 1, y: 0 });
      return;
    }

    prepareDraw(path);
    gsap.set(content, { opacity: 0, y: 16 });

    let cinematic: ReturnType<typeof registerCinematicSection> | null = null;

    const ctx = gsap.context(() => {
      // A one-shot narrative reveal — draw the string, then let the
      // headline settle in — so it follows the same enter/lock/play/
      // persist contract as the site's other cinematic sections instead
      // of replaying or reversing as the user scrolls past it.
      const tl = gsap.timeline({ paused: true });

      tl.to(path, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }).to(
        content,
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.5"
      );

      cinematic = registerCinematicSection(section, tl);
    }, section);

    return () => {
      cinematic?.cleanup();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-navy px-6 py-28 text-center"
    >
      <svg viewBox="0 0 300 120" className="h-16 w-40 sm:h-20 sm:w-48" aria-hidden="true">
        <path
          ref={pathRef}
          d={D}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <div ref={contentRef} className="mt-6">
        <h2 className="font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-ivory sm:text-6xl">
          What could
          <br />
          your idea <span className="text-gold">become?</span>
        </h2>

        <a
          href="mailto:info@abcmediamix.com"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[13px] font-semibold uppercase tracking-wide-label text-ink transition-transform hover:scale-105"
        >
          Let&apos;s find out
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
        </a>

        <p className="mt-16 text-[10px] font-medium uppercase tracking-[0.35em] text-ivory/40">
          Ideas &bull; Media &bull; Impact
        </p>
      </div>
    </section>
  );
}
