import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { registerCinematicSection } from "../lib/cinematicSection";
import { prepareDraw } from "../lib/paths";
import { siloScenes } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";

const FRAME_SHAPES: Record<string, JSX.Element> = {
  print: (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="30" y="20" width="140" height="160" fill="none" stroke="currentColor" strokeWidth="2" />
      {[0, 1, 2].map((col) => (
        <g key={col}>
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <line
              key={row}
              x1={44 + col * 45}
              y1={40 + row * 22}
              x2={44 + col * 45 + 32}
              y2={40 + row * 22}
              stroke="currentColor"
              strokeWidth="1.5"
              opacity={row === 0 ? 1 : 0.35}
            />
          ))}
        </g>
      ))}
    </svg>
  ),
  outdoor: (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="20" y="55" width="160" height="90" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="60" y1="145" x2="55" y2="180" stroke="currentColor" strokeWidth="2" />
      <line x1="140" y1="145" x2="145" y2="180" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="26" fill="currentColor" opacity="0.15" />
    </svg>
  ),
  television: (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="35" y="35" width="130" height="110" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="85" y1="160" x2="115" y2="160" stroke="currentColor" strokeWidth="2" />
      <line x1="100" y1="145" x2="100" y2="160" stroke="currentColor" strokeWidth="2" />
      <path d="M55,60 L145,60 M55,80 L120,80 M55,100 L140,100" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <rect x="65" y="20" width="70" height="160" rx="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="85" y1="150" x2="115" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <path d="M78,55 L122,55 M78,75 L110,75 M78,95 L118,95" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  ),
  event: (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <circle cx="100" cy="100" r="10" fill="currentColor" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * 22}
            y1={100 + Math.sin(a) * 22}
            x2={100 + Math.cos(a) * 70}
            y2={100 + Math.sin(a) * 70}
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.5"
          />
        );
      })}
    </svg>
  ),
  conversation: (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <path
        d="M40,60 h90 a12,12 0 0 1 12,12 v45 a12,12 0 0 1 -12,12 h-55 l-25,22 v-22 h-10 a12,12 0 0 1 -12,-12 v-45 a12,12 0 0 1 12,-12 z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="140" cy="120" r="4" fill="currentColor" />
      <circle cx="158" cy="108" r="3" fill="currentColor" opacity="0.6" />
    </svg>
  ),
};

export default function BreakSilos() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const threadRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const thread = threadRef.current;
    if (!section || !thread) return;

    if (reducedMotion) {
      frameRefs.current.forEach((f, i) => f && gsap.set(f, { opacity: i === 0 ? 1 : 0 }));
      return;
    }

    prepareDraw(thread);
    const n = siloScenes.length;
    const TOTAL_DURATION = 3.3;

    let cinematic: ReturnType<typeof registerCinematicSection> | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      tl.to(thread, { strokeDashoffset: 0, ease: "none", duration: TOTAL_DURATION }, 0);

      const segment = TOTAL_DURATION / n;

      frameRefs.current.forEach((frame, i) => {
        if (!frame) return;
        const start = i * segment;
        if (i > 0) {
          tl.to(frameRefs.current[i - 1], { opacity: 0, scale: 0.94, duration: segment * 0.4 }, start - segment * 0.15);
        }
        tl.fromTo(
          frame,
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: segment * 0.4 },
          start
        );
        const label = labelRefs.current[i];
        if (label) {
          if (i > 0) {
            const prevLabel = labelRefs.current[i - 1];
            if (prevLabel) {
              tl.to(prevLabel, { opacity: 0, y: -8, duration: segment * 0.25 }, start - segment * 0.15);
            }
          }
          tl.fromTo(label, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: segment * 0.3 }, start + segment * 0.15);
        }
      });

      cinematic = registerCinematicSection(section, tl);
    }, section);

    return () => {
      cinematic?.cleanup();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="insights"
      ref={sectionRef}
      className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-navy px-6 pb-6 pt-[var(--nav-h)] text-ivory"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-gold">NOT CHANNELS.</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight short:text-2xl sm:text-5xl">
          We break silos.
        </h2>
      </div>

      <div className="silo-stage relative mt-[min(3.5rem,5svh)] text-ivory/80">
        <svg
          className="pointer-events-none absolute -inset-x-20 top-1/2 -z-10 h-8 -translate-y-1/2 sm:-inset-x-32"
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={threadRef}
            d="M0,20 C100,4 140,36 200,20 C260,4 300,36 400,20"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>

        {siloScenes.map((scene, i) => (
          <div
            key={scene.id}
            ref={(el) => {
              frameRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {FRAME_SHAPES[scene.id]}
          </div>
        ))}
      </div>

      <div className="relative mt-[min(2rem,3svh)] h-5 w-full text-center">
        {siloScenes.map((scene, i) => (
          <span
            key={scene.id}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="absolute inset-x-0 text-[11px] font-semibold uppercase tracking-wide-label text-gold-light"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {scene.label}
          </span>
        ))}
      </div>
    </section>
  );
}
