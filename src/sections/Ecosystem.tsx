import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ecosystemNodes } from "../data/content";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

// Everything is a fraction of the board's side (--s, see .approach-board in
// globals.css). Fixed lengths (not %) so the translate() below resolves
// against the board, not each node button's own auto-sized box.
const ORBIT_RADIUS = "calc(var(--s) * 0.335)";

export default function Ecosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spokeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ringRef.current) return;
    const tween = gsap.to(ringRef.current, {
      rotate: 360,
      duration: 140,
      repeat: -1,
      ease: "none",
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  // Spokes live inside the same rotating ring as the nodes they connect to,
  // so they stay aligned to each node with zero extra positioning math —
  // a one-time reveal on scroll-into-view, not tied to the ambient spin.
  useEffect(() => {
    const spokes = spokeRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (spokes.length === 0) return;

    if (reducedMotion) {
      gsap.set(spokes, { scaleX: 1 });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.to(spokes, {
        scaleX: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 75%" },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (!ringRef.current) return;
    if (activeId) {
      gsap.to(ringRef.current, { timeScale: 0, duration: 0.6 });
    } else {
      gsap.to(ringRef.current, { timeScale: 1, duration: 0.6 });
    }
  }, [activeId]);

  const active = ecosystemNodes.find((n) => n.id === activeId) ?? null;

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-ivory-deep px-6 pb-4 pt-[var(--nav-h)]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-4 short:grid short:grid-cols-[minmax(0,1fr)_auto] short:grid-rows-[1fr_auto] short:items-center short:gap-x-10 short:gap-y-2 sm:gap-5">
        <div className="mx-auto max-w-xl text-center short:col-start-1 short:row-start-1 short:self-end short:text-left">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-gold">ONE IDEA.</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Many possibilities.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            We bring the right thinking, people and platforms together.
          </p>
        </div>

        <div className="approach-board relative mx-auto shrink-0 short:col-start-2 short:row-span-2 short:row-start-1">
          {/* connecting rings */}
          <div className="absolute inset-[8%] rounded-full border border-ink/10" />
          <div className="absolute inset-0 rounded-full border border-ink/5" />

          {/* center node */}
          <div
            className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-center shadow-[0_0_60px_rgba(159,115,44,0.35)]"
            style={{ width: "calc(var(--s) * 0.19)", height: "calc(var(--s) * 0.19)" }}
          >
            <span
              className="font-display font-bold uppercase tracking-widest text-ivory"
              style={{ fontSize: "clamp(8px, calc(var(--s) * 0.02), 11px)" }}
            >
              One
              <br />
              Idea
            </span>
          </div>

          {/* orbit ring of nodes */}
          <div ref={ringRef} className="absolute inset-0">
            {ecosystemNodes.map((node, i) => (
              <div
                key={`${node.id}-spoke`}
                className="absolute left-1/2 top-1/2 h-0 w-0"
                style={{ transform: `rotate(${node.angle}deg)` }}
                aria-hidden="true"
              >
                <div
                  ref={(el) => {
                    spokeRefs.current[i] = el;
                  }}
                  className="absolute left-0 top-0 h-px origin-left bg-gold/40"
                  style={{ width: ORBIT_RADIUS, transform: "scaleX(0)" }}
                />
              </div>
            ))}
            {ecosystemNodes.map((node) => (
              <OrbitNode
                key={node.id}
                angle={node.angle}
                label={node.label}
                active={activeId === node.id}
                dimmed={activeId !== null && activeId !== node.id}
                onSelect={() => setActiveId((cur) => (cur === node.id ? null : node.id))}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto h-[4.25rem] w-full max-w-lg text-center sm:h-[2.75rem] short:col-start-1 short:row-start-2 short:mx-0 short:self-start short:text-left">
          {!active && (
            <p className="text-[11px] leading-[2.75rem] text-ink-soft/60 short:leading-normal">
              Touch a possibility to see what it holds.
            </p>
          )}
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="flex flex-wrap items-center justify-center gap-2 short:justify-start">
                  {active.children.map((child, i) => (
                    <motion.span
                      key={child}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: 0.06 * i }}
                      className="rounded-full border border-gold/30 bg-paper px-4 py-1.5 text-xs font-medium text-ink-soft"
                    >
                      {child}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function OrbitNode({
  angle,
  label,
  active,
  dimmed,
  onSelect,
}: {
  angle: number;
  label: string;
  active: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  const radius = ORBIT_RADIUS;
  return (
    <div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <div
        className="absolute left-0 top-0 h-0 w-0"
        style={{ transform: `translate(${radius}, 0) rotate(${-angle}deg)` }}
      >
        <motion.button
          onClick={onSelect}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            width: "calc(var(--s) * 0.34)",
            padding: "calc(var(--s) * 0.022) calc(var(--s) * 0.02)",
            fontSize: "clamp(9px, calc(var(--s) * 0.021), 12px)",
            letterSpacing: "0.14em",
          }}
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap rounded-full border text-center font-semibold uppercase shadow-sm transition-colors ${
            active
              ? "border-gold bg-gold text-ivory"
              : dimmed
                ? "border-ink/10 bg-paper/60 text-ink-soft/50"
                : "border-ink/15 bg-paper text-ink hover:border-gold hover:text-gold"
          }`}
        >
          {label}
        </motion.button>
      </div>
    </div>
  );
}
