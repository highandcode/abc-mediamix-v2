import { useEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { prepareDraw } from "../lib/paths";
import { skipPastPin } from "../lib/skipPin";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { caseStudies, getCaseStudy, type CaseStudy } from "../data/work";
import { SliderButton, useSliderTrack } from "../components/SliderControls";
import SkipPin from "../components/editorial/SkipPin";
import PageTransition from "../components/editorial/PageTransition";
import PageProgress from "../components/editorial/PageProgress";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import PullQuote from "../components/editorial/PullQuote";
import StoryReveal from "../components/editorial/StoryReveal";

const STAGE_ORDER = ["brief", "idea", "execution"] as const;

export default function WorkCaseStudy() {
  const { slug = "" } = useParams();
  const study = getCaseStudy(slug);

  if (!study) return <Navigate to="/work" replace />;

  const next = caseStudies[study.index % caseStudies.length];

  return (
    <PageTransition>
      <PageProgress />
      <PageIndicator label={study.coverKicker} />

      <article>
        <CoverSpread study={study} />
        <ThreeStageSpread study={study} />
        <AmplificationStrip study={study} />
        <ImpactClose study={study} />
      </article>
      <NextStory next={next} />
    </PageTransition>
  );
}

function CoverSpread({ study }: { study: CaseStudy }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy px-6 pb-16 pt-32 text-ivory lg:px-12 lg:pb-24">
      <EditorialImage tone={study.tone} ratio="aspect-auto" className="absolute inset-0 -z-10 h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/10" />
      </EditorialImage>

      <StoryReveal>
        <div className="mx-auto flex w-full max-w-[1440px] items-baseline justify-between">
          <EditorialLabel tone="ivory">{study.coverKicker}</EditorialLabel>
          <Link
            to="/work"
            className="hidden text-[11px] font-medium tracking-wide-label text-ivory/60 transition-colors hover:text-gold sm:inline"
          >
            ALL STORIES
          </Link>
        </div>
      </StoryReveal>

      <div className="mx-auto w-full max-w-[1440px]">
        <StoryReveal delay={100}>
          <h1 className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
            {study.coverHeading.map((line, i) => (
              <span key={i} className="block">
                {i === study.coverHeading.length - 1 ? (
                  <span className="text-gold">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
        </StoryReveal>
        <StoryReveal delay={200}>
          <p className="mt-6 max-w-md font-serif text-lg italic text-ivory/70">{study.teaser}</p>
        </StoryReveal>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-6 flex items-center gap-3 lg:right-12">
        <span className="text-[10px] font-medium tracking-wide-label text-ivory/50">KEEP GOING</span>
        <span className="h-px w-10 bg-gold/50" />
      </div>
    </section>
  );
}

function ThreeStageSpread({ study }: { study: CaseStudy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const loopRef = useRef<SVGPathElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const thread = threadRef.current;
    const loop = loopRef.current;
    if (!section || !thread || !loop) return;

    if (reducedMotion) return;

    prepareDraw(thread);
    prepareDraw(loop);
    const n = STAGE_ORDER.length;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=260%",
          scrub: 0.8,
          pin: true,
        },
      });

      triggerRef.current = tl.scrollTrigger ?? null;

      tl.to(thread, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
      tl.to(loop, { strokeDashoffset: 0, ease: "none", duration: 0.4 }, 0.62);

      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const segment = 1 / n;
        const start = i * segment;
        if (i > 0) {
          tl.to(
            panelRefs.current[i - 1],
            { opacity: 0, y: -14, duration: segment * 0.4 },
            start - segment * 0.15
          );
        }
        tl.fromTo(panel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: segment * 0.4 }, start);
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
      className={`relative flex bg-ivory px-6 py-24 lg:px-12 ${
        reducedMotion ? "items-start" : "min-h-[100svh] items-center overflow-hidden"
      }`}
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
        <div className="relative hidden w-16 shrink-0 lg:block" aria-hidden="true">
          <svg viewBox="0 0 24 400" preserveAspectRatio="none" className="h-full w-6 overflow-visible">
            <path
              ref={threadRef}
              d="M12,0 C4,60 20,120 12,180 C4,240 20,300 12,400"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>
          <svg
            viewBox="0 0 60 30"
            className="absolute left-1/2 top-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2 overflow-visible"
          >
            <path
              ref={loopRef}
              d="M30,15 C22,4 8,4 8,15 C8,26 22,26 22,15 C22,4 38,4 30,15 C22,4 38,4 38,15 C38,26 52,26 52,15 C52,4 38,4 30,15"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="1"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Grid-stacked (not absolute + fixed vh) so the container's height
            always follows the tallest stage's copy instead of clipping it
            on short viewports — see the responsive audit notes. */}
        <div className={reducedMotion ? "relative" : "grid"}>
          {STAGE_ORDER.map((key, i) => {
            const stage = study.stages[key];
            return (
              <div
                key={key}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className={reducedMotion ? "relative mb-16 last:mb-0" : "[grid-area:1/1] self-start"}
                style={reducedMotion ? undefined : { opacity: i === 0 ? 1 : 0 }}
              >
                <EditorialLabel>{stage.label}</EditorialLabel>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold uppercase leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  {stage.heading}
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">{stage.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      {!reducedMotion && <SkipPin onSkip={() => skipPastPin(triggerRef.current, sectionRef.current)} />}
    </section>
  );
}

function AmplificationStrip({ study }: { study: CaseStudy }) {
  const { trackRef, edges, updateEdges, slide } = useSliderTrack({ autoScroll: true });

  return (
    <section
      id="amplification"
      className="relative overflow-hidden bg-navy py-20 text-ivory lg:py-0"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 lg:h-[70vh] lg:grid-cols-[0.8fr_1.6fr] lg:items-center lg:gap-16 lg:px-12">
        <StoryReveal>
          <EditorialLabel tone="ivory">THE AMPLIFICATION</EditorialLabel>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl">
            Where it <span className="text-gold">travelled.</span>
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/60">
            One idea. Discovered in more places than the brief asked for.
          </p>
        </StoryReveal>

        <div className="relative min-w-0">
          <div
            ref={trackRef}
            onScroll={updateEdges}
            className="flex gap-5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {study.mediums.map((medium, i) => (
              <div
                key={medium}
                data-slide
                className="flex h-[220px] w-[220px] shrink-0 flex-col justify-between border border-ivory/15 p-6 sm:h-[260px] sm:w-[260px]"
                style={{ background: "rgba(244,241,234,0.03)" }}
              >
                <span className="font-display text-4xl font-bold text-gold/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg font-bold uppercase tracking-tight text-ivory">
                  {medium}
                </span>
              </div>
            ))}
            <div className="flex h-[220px] w-[160px] shrink-0 items-center sm:h-[260px]">
              <span className="text-xs text-ivory/40">and further, still.</span>
            </div>
          </div>

          <SliderButton direction="prev" tone="dark" disabled={edges.start} onClick={() => slide(-1)} className="left-2" />
          <SliderButton direction="next" tone="dark" disabled={edges.end} onClick={() => slide(1)} className="right-2" />
        </div>
      </div>
    </section>
  );
}

function ImpactClose({ study }: { study: CaseStudy }) {
  return (
    <section className="relative bg-ivory px-6 py-28 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-3xl text-center">
        <StoryReveal>
          <EditorialLabel>{study.stages.impact.label}</EditorialLabel>
        </StoryReveal>
        <StoryReveal delay={100}>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {study.stages.impact.heading}
          </h2>
        </StoryReveal>
        <StoryReveal delay={180} className="mt-8 flex justify-center">
          <PullQuote className="text-left">{study.stages.impact.body}</PullQuote>
        </StoryReveal>
      </div>
    </section>
  );
}

function NextStory({ next }: { next: CaseStudy }) {
  return (
    <section className="relative border-t border-ink/10 bg-paper px-6 py-16 lg:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <EditorialLabel>NEXT STORY</EditorialLabel>
          <Link
            to={`/work/${next.slug}`}
            className="mt-2 block font-display text-2xl font-bold text-ink transition-colors hover:text-gold sm:text-3xl"
          >
            {next.title}
          </Link>
        </div>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide-label text-ink-soft transition-colors hover:text-gold"
        >
          All stories <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
