import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../components/editorial/PageTransition";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import GoldThread from "../components/editorial/GoldThread";
import StoryReveal from "../components/editorial/StoryReveal";

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

// Every section below is one frame (`data-frame`): one screen tall, and the
// section navigator slides between them. See `.frame` in globals.css.
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
    <section data-frame className="frame bg-ivory px-6 lg:px-12">
      <div className="frame-inner">
        <StoryReveal>
          <EditorialLabel>ABC / APPROACH</EditorialLabel>
        </StoryReveal>
        <StoryReveal delay={100}>
          <h1
            className="frame-display mt-4 max-w-5xl font-display font-extrabold uppercase tracking-tight text-ink"
            style={{ "--chars": 8 } as CSSProperties}
          >
            How ABC <span className="text-gold">thinks.</span>
          </h1>
        </StoryReveal>
      </div>
    </section>
  );
}

function StatementSequence() {
  return (
    <section data-frame className="frame bg-navy px-6 text-ivory lg:px-12">
      <div className="frame-inner">
        <ol className="relative flex flex-col gap-[min(2.6svh,1.5rem)] border-l border-gold/50 pl-5 sm:pl-8 lg:pl-12">
          {STATEMENTS.map((lines, i) => (
            <li key={i}>
              <StoryReveal delay={i * 140}>
                <h2 className="frame-statement font-display font-extrabold uppercase tracking-tight">
                  {lines.map((line, j) => (
                    <span key={j} className={j === lines.length - 1 ? "text-gold" : undefined}>
                      {j > 0 && " "}
                      {line}
                    </span>
                  ))}
                </h2>
              </StoryReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function IntegrationFlow() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = FLOW.find((n) => n.id === activeId) ?? null;

  return (
    <section data-frame className="frame bg-ivory-deep px-6 lg:px-12">
      <div className="frame-inner grid grid-cols-1 gap-[min(2.4svh,1.5rem)] md:grid-cols-2 md:items-center md:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <StoryReveal>
            <EditorialLabel>ONE IDEA. CONNECTED EXECUTION.</EditorialLabel>
            <h2
              className="frame-title mt-3 max-w-lg font-display font-extrabold uppercase tracking-tight text-ink"
              style={{ "--chars": 14 } as CSSProperties}
            >
              Everything moves through the same line.
            </h2>
          </StoryReveal>

          {/* Fixed height, so opening Media never changes the frame's size. */}
          <div className="mt-[min(2.4svh,1.5rem)] h-[4.5rem] short:h-8">
            <AnimatePresence mode="wait" initial={false}>
              {active?.children ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-2"
                >
                  {active.children.map((child, ci) => (
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
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[11px] text-ink-soft/60"
                >
                  Touch a stage to see what it holds.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flow-list relative w-full max-w-xl md:justify-self-end">
          <div
            className="absolute w-px bg-ink/10"
            style={{ left: "calc(var(--row) * 0.31)", top: "calc(var(--row) / 2)", bottom: "calc(var(--row) / 2)" }}
          />
          <ol>
            {FLOW.map((node, i) => {
              const isActive = activeId === node.id;
              const hasChildren = !!node.children;
              return (
                <li key={node.id}>
                  <StoryReveal delay={i * 60}>
                    <button
                      onClick={() => hasChildren && setActiveId((cur) => (cur === node.id ? null : node.id))}
                      className={`flow-row group relative z-10 flex w-full items-center gap-4 rounded-lg text-left transition-colors sm:gap-5 ${
                        hasChildren ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      <span
                        className={`flow-dot flex shrink-0 items-center justify-center rounded-full border font-bold transition-colors ${
                          isActive
                            ? "border-gold bg-gold text-ivory"
                            : "border-ink/20 bg-paper text-ink-soft group-hover:border-gold group-hover:text-gold"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`flow-label font-display font-bold uppercase tracking-tight transition-colors ${
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
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TransformationSequence() {
  return (
    <section data-frame className="frame bg-ivory px-6 lg:px-12">
      <div className="frame-inner">
        <StoryReveal>
          <EditorialLabel>ONE IDEA BECOMES MANY EXPRESSIONS.</EditorialLabel>
        </StoryReveal>

        <div className="mt-[min(3.5svh,2.5rem)] grid grid-cols-1 gap-x-8 gap-y-[min(1.8svh,1rem)] sm:grid-cols-3 sm:gap-y-[min(6svh,3.5rem)] lg:gap-x-12">
          {EXPRESSIONS.map((exp, i) => (
            <StoryReveal key={exp.step} delay={i * 60}>
              <div className="border-t border-ink/10 pt-[min(1.4svh,0.75rem)]">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-xs font-bold text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="frame-step font-display font-extrabold uppercase tracking-tight text-ink">
                    {exp.step}
                  </h3>
                </div>
                <p className="frame-text mt-1 max-w-xs leading-snug text-ink-soft">{exp.detail}</p>
              </div>
            </StoryReveal>
          ))}
        </div>

        <StoryReveal delay={380} className="mt-[min(3.5svh,2rem)] flex items-center justify-center gap-4 short:hidden">
          <GoldThread variant="loop" className="hidden w-16 sm:block" />
          <p className="text-sm text-ink-soft">Then everything reconnects.</p>
        </StoryReveal>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section data-frame className="frame items-center border-t border-ink/10 bg-paper px-6 text-center lg:px-12">
      <StoryReveal>
        <p className="mx-auto max-w-md font-serif italic text-ink" style={{ fontSize: "clamp(1.5rem, min(6vw, 5svh), 2.25rem)" }}>
          One idea. Connected execution.
        </p>
      </StoryReveal>
    </section>
  );
}
