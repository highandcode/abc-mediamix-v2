import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ecosystemNodes } from "../data/content";
import { gsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

// Fixed-length (not %) so the translate() below resolves against the
// viewport, not each node button's own auto-sized box.
const ORBIT_RADIUS = "clamp(5.5rem, 26vw, 12.5rem)";

export default function Ecosystem() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const ringRef = useRef<HTMLDivElement>(null);
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
      className="relative overflow-hidden bg-ivory-deep px-6 py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-gold">ONE IDEA.</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Many possibilities.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            We bring the right thinking, people and platforms together.
            <br />
            <span className="text-ink-soft/70">Touch a possibility to see what it holds.</span>
          </p>
        </div>

        <div className="relative mx-auto mt-16 aspect-square w-[86vw] max-w-[600px] sm:w-[70vw] lg:mt-20">
          {/* connecting rings */}
          <div className="absolute inset-[8%] rounded-full border border-ink/10" />
          <div className="absolute inset-0 rounded-full border border-ink/5" />

          {/* center node */}
          <div className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-center shadow-[0_0_60px_rgba(159,115,44,0.35)] sm:h-28 sm:w-28">
            <span className="font-display text-[11px] font-bold uppercase tracking-widest text-ivory">
              One
              <br />
              Idea
            </span>
          </div>

          {/* orbit ring of nodes */}
          <div ref={ringRef} className="absolute inset-0">
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

        <div className="mx-auto mt-10 h-[92px] max-w-lg text-center">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="flex flex-wrap items-center justify-center gap-2">
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
          className={`flex w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap rounded-full border px-2 py-1.5 text-center text-[9px] font-semibold uppercase tracking-normal shadow-sm transition-colors sm:w-48 sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.22em] ${
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
