import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { prepareDraw } from "../lib/paths";
import { skipPastPin } from "../lib/skipPin";
import { useReducedMotion } from "../hooks/useReducedMotion";
import PageTransition from "../components/editorial/PageTransition";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import GoldThread from "../components/editorial/GoldThread";
import StoryReveal from "../components/editorial/StoryReveal";
import SkipPin from "../components/editorial/SkipPin";

const STATEMENTS = [
  ["START", "WITH THE", "QUESTION."],
  ["FIND", "THE IDEA."],
  ["FIND WHERE", "IT BELONGS."],
  ["MAKE IT", "TRAVEL."],
  ["MAKE IT", "MATTER."],
];

const FLOW = [
  { id: "idea", label: "Idea" },
  { id: "strategy", label: "Strategy" },
  { id: "creative", label: "Creative" },
  { id: "media", label: "Media", children: ["Television", "Radio", "Print", "Outdoor", "Digital"] },
  { id: "communication", label: "Communication" },
  { id: "experience", label: "Experience" },
  { id: "impact", label: "Impact" },
];

const EXPRESSIONS = [
  { step: "WORD", detail: "A single thought, before it has a shape." },
  { step: "IMAGE", detail: "The thought finds its first form." },
  { step: "HEADLINE", detail: "The form finds its voice." },
  { step: "CAMPAIGN", detail: "The voice becomes many moments." },
  { step: "MEDIA", detail: "The moments find their places." },
  { step: "PUBLIC RESPONSE", detail: "The places give it back, changed." },
];

export default function Approach() {
  return (
    <PageTransition>
      <PageIndicator label="ABC / APPROACH" />
      <Opener />
      <StatementSequence />
      <IntegrationFlow />
      <TransformationSequence />
      <Close />
    </PageTransition>
  );
}

function Opener() {
  return (
    <section className="relative flex min-h-[70svh] flex-col justify-end bg-ivory px-6 pb-16 pt-32 lg:px-12">
      <StoryReveal>
        <EditorialLabel>ABC / APPROACH</EditorialLabel>
      </StoryReveal>
      <StoryReveal delay={100}>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.98] tracking-tight text-ink sm:text-7xl">
          How ABC <span className="text-gold">thinks.</span>
        </h1>
      </StoryReveal>
    </section>
  );
}

function StatementSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const thread = threadRef.current;
    if (!section || !thread) return;

    if (reducedMotion) return;

    prepareDraw(thread);
    const n = STATEMENTS.length;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          scrub: 0.8,
          pin: true,
        },
      });

      triggerRef.current = tl.scrollTrigger ?? null;

      tl.to(thread, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const segment = 1 / n;
        const start = i * segment;
        if (i > 0) {
          tl.to(panelRefs.current[i - 1], { opacity: 0, scale: 0.92, duration: segment * 0.4 }, start - segment * 0.15);
        }
        tl.fromTo(
          panel,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: segment * 0.4 },
          start
        );
      });
    }, section);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      triggerRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className={`relative flex bg-navy px-6 py-24 text-center text-ivory ${
        reducedMotion ? "items-start" : "min-h-[100svh] items-center justify-center overflow-hidden"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 500"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 overflow-visible opacity-70"
      >
        <path
          ref={threadRef}
          d="M12,0 C4,80 20,160 12,250 C4,340 20,420 12,500"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Grid-stacked (not absolute + fixed vh) so the container's height
          always follows the tallest statement instead of clipping it on
          short viewports — see the responsive audit notes. */}
      <div className={reducedMotion ? "flex w-full flex-col gap-24 py-24" : "grid w-full place-items-center py-10"}>
        {STATEMENTS.map((lines, i) => (
          <div
            key={i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={reducedMotion ? "" : "[grid-area:1/1] flex items-center justify-center"}
            style={reducedMotion ? undefined : { opacity: i === 0 ? 1 : 0 }}
          >
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl">
              {lines.map((line, j) => (
                <span key={j} className={j === lines.length - 1 ? "block text-gold" : "block"}>
                  {line}
                </span>
              ))}
            </h2>
          </div>
        ))}
      </div>

      {!reducedMotion && (
        <SkipPin tone="light" onSkip={() => skipPastPin(triggerRef.current, sectionRef.current)} />
      )}
    </section>
  );
}

function IntegrationFlow() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = FLOW.find((n) => n.id === activeId) ?? null;

  return (
    <section className="relative bg-ivory-deep px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <StoryReveal>
          <EditorialLabel>ONE IDEA. CONNECTED EXECUTION.</EditorialLabel>
          <h2 className="mt-3 max-w-lg font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Everything moves through the same line.
          </h2>
        </StoryReveal>

        <div className="relative mx-auto mt-16 max-w-xl">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-ink/10 sm:left-[19px]" />
          <ol className="flex flex-col gap-2">
            {FLOW.map((node, i) => {
              const isActive = activeId === node.id;
              const hasChildren = !!node.children;
              return (
                <li key={node.id}>
                  <StoryReveal delay={i * 60}>
                    <button
                      onClick={() => hasChildren && setActiveId((cur) => (cur === node.id ? null : node.id))}
                      className={`group relative z-10 flex w-full items-center gap-5 rounded-lg py-3 pl-0 text-left transition-colors ${
                        hasChildren ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors sm:h-10 sm:w-10 ${
                          isActive
                            ? "border-gold bg-gold text-ivory"
                            : "border-ink/20 bg-paper text-ink-soft group-hover:border-gold group-hover:text-gold"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`font-display text-xl font-bold uppercase tracking-tight transition-colors sm:text-2xl ${
                          isActive ? "text-gold" : "text-ink group-hover:text-gold"
                        }`}
                      >
                        {node.label}
                      </span>
                      {hasChildren && (
                        <span className="ml-auto text-[10px] font-medium uppercase tracking-wide-label text-ink-soft/60">
                          {isActive ? "close" : "discover"}
                        </span>
                      )}
                    </button>
                  </StoryReveal>

                  <AnimatePresence>
                    {isActive && hasChildren && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="overflow-hidden pl-13 sm:pl-15"
                      >
                        <div className="flex flex-wrap gap-2 py-3 pl-13 sm:pl-15">
                          {node.children!.map((child, ci) => (
                            <motion.span
                              key={child}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.25, delay: ci * 0.05 }}
                              className="rounded-full border border-gold/30 bg-paper px-3.5 py-1.5 text-xs font-medium text-ink-soft"
                            >
                              {child}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mt-2 h-4 text-center text-[11px] text-ink-soft/50">
          {!active && "Touch a stage to see what it holds."}
        </p>
      </div>
    </section>
  );
}

function TransformationSequence() {
  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-28 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1440px]">
        <StoryReveal>
          <EditorialLabel>ONE IDEA BECOMES MANY EXPRESSIONS.</EditorialLabel>
        </StoryReveal>

        <div className="mt-14 flex flex-col gap-14 lg:gap-20">
          {EXPRESSIONS.map((exp, i) => (
            <StoryReveal key={exp.step} delay={i * 40}>
              <div
                className={`flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8 ${
                  i % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""
                }`}
              >
                <span className="font-display text-2xl font-bold text-ink-soft/25 sm:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-4xl font-extrabold uppercase tracking-tight text-ink sm:text-6xl lg:text-7xl">
                  {exp.step}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-ink-soft sm:ml-auto">{exp.detail}</p>
              </div>
            </StoryReveal>
          ))}
        </div>

        <StoryReveal className="mt-16 flex justify-center">
          <GoldThread variant="loop" className="w-40" />
        </StoryReveal>
        <StoryReveal delay={80} className="mt-4 text-center">
          <p className="text-sm text-ink-soft">Then everything reconnects.</p>
        </StoryReveal>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="relative border-t border-ink/10 bg-paper px-6 py-20 text-center lg:px-12">
      <StoryReveal>
        <p className="mx-auto max-w-md font-serif text-2xl italic text-ink sm:text-3xl">
          One idea. Connected execution.
        </p>
      </StoryReveal>
    </section>
  );
}
