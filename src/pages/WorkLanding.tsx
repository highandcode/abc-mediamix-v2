import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/editorial/PageTransition";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import StoryReveal from "../components/editorial/StoryReveal";
import PageIndicator from "../components/editorial/PageIndicator";
import { SliderButton, useSliderTrack } from "../components/SliderControls";
import { campaigns } from "../data/campaigns";
import { workSamples, type WorkSample } from "../data/samples";
import { MEDIUM_LABELS, MEDIUM_ORDER, type Medium } from "../data/mediums";

type Filter = Medium | "all";

// Every section below is one frame (`data-frame`): one screen tall, and the
// section navigator slides between them. See `.frame` in globals.css.
export default function WorkLanding() {
  return (
    <PageTransition>
      <PageIndicator label="ABC / WORK" />
      <Opener />
      <CampaignSpotlights />
      <Gallery />
    </PageTransition>
  );
}

function Opener() {
  return (
    <section data-frame className="frame bg-ivory px-6 lg:px-12">
      <div className="frame-inner">
        <StoryReveal>
          <EditorialLabel>ABC / WORK</EditorialLabel>
        </StoryReveal>
        <StoryReveal delay={80}>
          <h1
            className="frame-display mt-4 max-w-5xl font-display font-extrabold uppercase tracking-tight text-ink"
            style={{ "--chars": 16 } as CSSProperties}
          >
            Real work,
            <br />
            for real <span className="text-gold">clients.</span>
          </h1>
        </StoryReveal>
        <StoryReveal delay={160}>
          <p className="mt-[min(3svh,1.5rem)] max-w-sm font-serif text-lg italic text-ink-soft sm:text-xl">
            A couple of full stories, and a growing library of single pieces — browsable by medium.
          </p>
        </StoryReveal>
      </div>
    </section>
  );
}

function CampaignSpotlights() {
  return (
    <section data-frame className="frame bg-ivory px-6 lg:px-12">
      <div className="frame-inner">
        <StoryReveal>
          <div className="flex items-baseline justify-between border-t border-ink/10 pt-[min(2svh,1rem)]">
            <EditorialLabel>FULL STORIES</EditorialLabel>
            <span className="hidden text-[11px] tracking-wide-label text-ink-soft/60 sm:inline">
              MULTI-CHANNEL CAMPAIGNS
            </span>
          </div>
        </StoryReveal>

        <div className="mt-[min(2.4svh,1.5rem)] grid grid-cols-1 gap-5 sm:grid-cols-2">
          {campaigns.map((c, i) => (
            <StoryReveal key={c.slug} delay={i * 100}>
              <Link
                to={`/work/${c.slug}`}
                className="group block h-[38svh] lg:h-[min(calc(100svh-var(--nav-h)-9rem),30rem)] short:h-[calc(100svh-var(--nav-h)-7rem)]"
              >
                <EditorialImage
                  tone={c.tone}
                  src={c.heroImage}
                  focalPoint={c.heroFocalPoint}
                  ratio="aspect-auto"
                  className="h-full"
                >
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <p className="text-[10px] font-semibold uppercase tracking-wide-label text-ivory/70">{c.client}</p>
                    <h2 className="mt-1 font-display text-xl font-bold uppercase leading-snug text-ivory sm:text-2xl">
                      {c.coverHeading.join(" ")}
                    </h2>
                    <span className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide-label text-gold-pale">
                      Open the story
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </EditorialImage>
              </Link>
            </StoryReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const { trackRef, edges, updateEdges, slide } = useSliderTrack({ autoScroll: true });

  const items = useMemo(
    () => (filter === "all" ? workSamples : workSamples.filter((s) => s.medium === filter)),
    [filter]
  );

  // A filter change swaps the whole item set — start the track from the
  // left again and recompute the arrow-visibility edges for the new width.
  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0;
    updateEdges();
  }, [filter, trackRef, updateEdges]);

  return (
    <section data-frame className="frame bg-paper px-6 lg:px-12">
      <div className="frame-inner">
        <StoryReveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-ink/10 pt-[min(2svh,1rem)]">
            <EditorialLabel>THE LIBRARY</EditorialLabel>
            <span className="text-[11px] tracking-wide-label text-ink-soft/60">
              {items.length} PIECE{items.length === 1 ? "" : "S"}
            </span>
          </div>
        </StoryReveal>

        <StoryReveal delay={60} className="mt-[min(2svh,1rem)] flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterChip>
          {MEDIUM_ORDER.map((m) => (
            <FilterChip key={m} active={filter === m} onClick={() => setFilter(m)}>
              {MEDIUM_LABELS[m]}
            </FilterChip>
          ))}
        </StoryReveal>

        <div className="relative mt-[min(2.4svh,1.5rem)]">
          <div
            ref={trackRef}
            onScroll={updateEdges}
            className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((sample) => (
              <GalleryTile key={sample.id} sample={sample} />
            ))}
            <div className="flex w-[120px] shrink-0 items-center">
              <span className="text-xs text-ink-soft/50">and more, always.</span>
            </div>
          </div>

          <SliderButton direction="prev" disabled={edges.start} onClick={() => slide(-1)} className="left-1" />
          <SliderButton direction="next" disabled={edges.end} onClick={() => slide(1)} className="right-1" />
        </div>
      </div>
    </section>
  );
}

function GalleryTile({ sample }: { sample: WorkSample }) {
  const content = (
    <>
      <div className="aspect-[4/5] w-full">
        <EditorialImage
          tone={sample.tone}
          src={sample.image}
          focalPoint={sample.focalPoint}
          ratio="aspect-auto"
          className="h-full"
        />
      </div>
      <div className="p-2.5">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide-label text-ink">{sample.client}</p>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-ink-soft">{sample.caption}</p>
        {sample.campaignSlug && (
          <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide-label text-gold">
            Full story →
          </span>
        )}
      </div>
    </>
  );

  const className = "group w-[180px] shrink-0 overflow-hidden border border-ink/10 bg-ivory sm:w-[220px]";

  return sample.campaignSlug ? (
    <Link to={`/work/${sample.campaignSlug}`} data-slide className={`${className} block transition-opacity hover:opacity-90`}>
      {content}
    </Link>
  ) : (
    <div data-slide className={className}>
      {content}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium uppercase tracking-wide-label transition-colors ${
        active
          ? "border-gold bg-gold text-ivory"
          : "border-ink/20 text-ink-soft hover:border-gold hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}
