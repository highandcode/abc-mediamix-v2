import type { CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { campaigns, getCampaign, type Campaign } from "../data/campaigns";
import { getSamplesForCampaign, type WorkSample } from "../data/samples";
import { MEDIUM_LABELS } from "../data/mediums";
import { SliderButton, useSliderTrack } from "../components/SliderControls";
import PageTransition from "../components/editorial/PageTransition";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import PullQuote from "../components/editorial/PullQuote";
import StoryReveal from "../components/editorial/StoryReveal";

const STAGE_ORDER = ["brief", "idea", "execution"] as const;

// Every section below is one frame (`data-frame`): one screen tall, and the
// section navigator slides between them — the brief, the idea and the
// execution each get their own, in place of the old scroll-pinned spread.
export default function WorkCaseStudy() {
  const { slug = "" } = useParams();
  const campaign = getCampaign(slug);

  if (!campaign) return <Navigate to="/work" replace />;

  const next = campaigns[campaign.index % campaigns.length];
  const samples = getSamplesForCampaign(campaign.slug);

  return (
    <PageTransition>
      <PageIndicator label={campaign.coverKicker} />

      <article>
        <CoverSpread campaign={campaign} />
        {STAGE_ORDER.map((key, i) => (
          <StageFrame key={key} stage={campaign.stages[key]} number={i + 1} />
        ))}
        <AmplificationStrip campaign={campaign} samples={samples} />
        <ImpactClose campaign={campaign} next={next} />
      </article>
    </PageTransition>
  );
}

function CoverSpread({ campaign }: { campaign: Campaign }) {
  return (
    <section data-frame className="frame isolate justify-end bg-navy px-6 pb-14 text-ivory lg:px-12 lg:pb-20">
      <EditorialImage
        tone={campaign.tone}
        src={campaign.heroImage}
        focalPoint={campaign.heroFocalPoint}
        ratio="aspect-auto"
        className="absolute inset-0 -z-10 h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/10" />
      </EditorialImage>

      <StoryReveal>
        <div className="mx-auto flex w-full max-w-[1440px] items-baseline justify-between">
          <EditorialLabel tone="ivory">{campaign.coverKicker}</EditorialLabel>
          <Link
            to="/work"
            className="hidden text-[11px] font-medium tracking-wide-label text-ivory/60 transition-colors hover:text-gold sm:inline"
          >
            ALL WORK
          </Link>
        </div>
      </StoryReveal>

      <div className="mx-auto w-full max-w-[1440px]">
        <StoryReveal delay={100}>
          <h1
            className="frame-display mt-[min(3svh,1.5rem)] font-display font-extrabold uppercase tracking-tight"
            style={{ "--chars": 14 } as CSSProperties}
          >
            {campaign.coverHeading.map((line, i) => (
              <span key={i} className="block">
                {i === campaign.coverHeading.length - 1 ? (
                  <span className="text-gold">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
        </StoryReveal>
        <StoryReveal delay={180}>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide-label text-ivory/50">{campaign.client}</p>
        </StoryReveal>
        <StoryReveal delay={200}>
          <p className="mt-[min(3svh,1.5rem)] max-w-md font-serif text-base italic text-ivory/70 sm:text-lg">{campaign.teaser}</p>
        </StoryReveal>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-6 flex items-center gap-3 lg:right-12">
        <span className="text-[10px] font-medium tracking-wide-label text-ivory/50">KEEP GOING</span>
        <span className="h-px w-10 bg-gold/50" />
      </div>
    </section>
  );
}

function StageFrame({ stage, number }: { stage: Campaign["stages"]["brief"]; number: number }) {
  return (
    <section data-frame className="frame bg-ivory px-6 lg:px-12">
      <div className="frame-inner">
        <div className="border-l border-gold/50 pl-5 sm:pl-8 lg:pl-12">
          <StoryReveal>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-sm font-bold text-gold">{String(number).padStart(2, "0")}</span>
              <EditorialLabel>{stage.label}</EditorialLabel>
            </div>
          </StoryReveal>
          <StoryReveal delay={100}>
            <h2
              className="frame-display mt-[min(3svh,1.5rem)] max-w-4xl font-display font-extrabold uppercase tracking-tight text-ink"
              style={{ "--chars": 22 } as CSSProperties}
            >
              {stage.heading}
            </h2>
          </StoryReveal>
          <StoryReveal delay={200}>
            <p className="frame-text mt-[min(3svh,1.75rem)] max-w-md leading-relaxed text-ink-soft">{stage.body}</p>
          </StoryReveal>
        </div>
      </div>
    </section>
  );
}

function AmplificationStrip({ campaign, samples }: { campaign: Campaign; samples: WorkSample[] }) {
  const { trackRef, edges, updateEdges, slide } = useSliderTrack({ autoScroll: true });

  return (
    <section id="amplification" data-frame className="frame bg-navy px-6 text-ivory lg:px-12">
      <div className="frame-inner grid grid-cols-1 gap-[min(4svh,2rem)] lg:grid-cols-[0.8fr_1.6fr] lg:items-center lg:gap-16 short:grid-cols-[0.8fr_1.6fr] short:items-center short:gap-8">
        <StoryReveal>
          <EditorialLabel tone="ivory">THE MEDIUMS</EditorialLabel>
          <h2
            className="frame-title mt-4 font-display font-extrabold uppercase tracking-tight"
            style={{ "--chars": 10 } as CSSProperties}
          >
            Where it <span className="text-gold">travelled.</span>
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/60">
            The same identity, carried across every real medium this campaign actually ran in.
          </p>
        </StoryReveal>

        <div className="relative min-w-0">
          <div
            ref={trackRef}
            onScroll={updateEdges}
            className="flex gap-5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {samples.map((sample, i) => (
              <div key={sample.id} data-slide className="slide-card flex shrink-0 flex-col overflow-hidden border border-ivory/15">
                <div className="relative h-[55%] w-full">
                  <EditorialImage
                    tone={sample.tone ?? campaign.tone}
                    src={sample.image}
                    focalPoint={sample.focalPoint}
                    ratio="aspect-auto"
                    className="h-full"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4" style={{ background: "rgba(244,241,234,0.03)" }}>
                  <span className="font-display text-2xl font-bold text-gold/40">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <span className="font-display text-base font-bold uppercase tracking-tight text-ivory">
                      {MEDIUM_LABELS[sample.medium]}
                    </span>
                    <p className="mt-1 text-xs leading-snug text-ivory/60">{sample.caption}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex w-[160px] shrink-0 items-center">
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

function ImpactClose({ campaign, next }: { campaign: Campaign; next: Campaign }) {
  return (
    <section data-frame className="frame bg-ivory px-6 lg:px-12">
      <div className="frame-inner">
        <div className="mx-auto max-w-3xl text-center">
          <StoryReveal>
            <EditorialLabel>{campaign.stages.impact.label}</EditorialLabel>
          </StoryReveal>
          <StoryReveal delay={100}>
            <h2
              className="frame-title mt-4 font-display font-extrabold uppercase tracking-tight text-ink"
              style={{ "--chars": 20 } as CSSProperties}
            >
              {campaign.stages.impact.heading}
            </h2>
          </StoryReveal>
          <StoryReveal delay={180} className="mt-[min(3.5svh,2rem)] flex justify-center">
            <PullQuote className="frame-quote text-left">{campaign.stages.impact.body}</PullQuote>
          </StoryReveal>
        </div>

        <StoryReveal delay={260}>
          <NextStory next={next} />
        </StoryReveal>
      </div>
    </section>
  );
}

function NextStory({ next }: { next: Campaign }) {
  return (
    <div className="mt-[min(5svh,3rem)] flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-[min(3svh,1.5rem)] sm:flex-row sm:items-center">
      <div>
        <EditorialLabel>NEXT STORY</EditorialLabel>
        <Link
          to={`/work/${next.slug}`}
          className="frame-heading mt-1 block font-display font-bold text-ink transition-colors hover:text-gold"
        >
          {next.client}
        </Link>
      </div>
      <Link
        to="/work"
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide-label text-ink-soft transition-colors hover:text-gold"
      >
        All work <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
