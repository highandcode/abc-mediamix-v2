import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { registerCinematicSection } from "../lib/cinematicSection";
import { infinityPath, prepareDraw } from "../lib/paths";
import { useReducedMotion } from "../hooks/useReducedMotion";

const CX = 300;
const CY = 200;

function buildPath() {
  const loop = infinityPath(CX, CY, 260, 130, 140);
  const firstComma = loop.indexOf(",");
  const firstL = loop.indexOf("L", firstComma);
  const startX = loop.slice(1, loop.indexOf(","));
  const startY = loop.slice(loop.indexOf(",") + 1, firstL);
  return `M${CX},${CY} L${startX},${startY} ${loop.slice(firstL)}`;
}

export default function StringInfinity() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const echoRefs = useRef<(SVGPathElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    const text = textRef.current;
    if (!section || !path || !text) return;

    if (reducedMotion) {
      path.style.strokeDasharray = "none";
      gsap.set(text, { opacity: 1, y: 0 });
      return;
    }

    prepareDraw(path);
    echoRefs.current.forEach((el) => el && prepareDraw(el));
    gsap.set(text, { opacity: 0, y: 16 });

    let cinematic: ReturnType<typeof registerCinematicSection> | null = null;

    const ctx = gsap.context(() => {
      // Ends on a composition that stays on screen — draw, reveal the line,
      // let the echoes settle in as a persistent ambient halo. Nothing here
      // fades back out: the section is meant to stay "open," not dissolve
      // once the sequence finishes.
      const tl = gsap.timeline({ paused: true });

      tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1.5 }, 0)
        .to(text, { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" }, 1.55)
        .to(
          echoRefs.current.filter(Boolean),
          { strokeDashoffset: 0, opacity: 0.35, duration: 0.4, stagger: 0.06 },
          1.85
        );

      cinematic = registerCinematicSection(section, tl);
    }, section);

    return () => {
      cinematic?.cleanup();
      ctx.revert();
    };
  }, [reducedMotion]);

  const d = buildPath();

  return (
    <section
      id="string-infinity"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-navy short:min-h-0 short:py-6"
    >
      <svg
        viewBox="0 0 600 400"
        className="h-auto w-full max-w-3xl px-10 short:max-w-xs short:px-4"
        aria-hidden="true"
      >
        {[-18, 18].map((rot, i) => (
          <path
            key={rot}
            ref={(el) => {
              echoRefs.current[i] = el;
            }}
            d={d}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="0.75"
            opacity="0"
            style={{ transformOrigin: `${CX}px ${CY}px`, transform: `rotate(${rot}deg)` }}
          />
        ))}
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-center"
      >
        <span className="font-display text-3xl font-extrabold uppercase tracking-tight text-ivory short:text-lg sm:text-5xl">
          One idea.
        </span>
        <span className="font-display text-3xl font-extrabold uppercase tracking-tight text-gold short:text-lg sm:text-5xl">
          Infinite possibilities.
        </span>
      </div>
    </section>
  );
}
