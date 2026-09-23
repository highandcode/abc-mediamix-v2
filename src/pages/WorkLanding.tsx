import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/editorial/PageTransition";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import StoryReveal from "../components/editorial/StoryReveal";
import PageIndicator from "../components/editorial/PageIndicator";
import { campaigns } from "../data/campaigns";
import { workSamples } from "../data/samples";
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
                <EditorialImage tone={c.tone} src={c.heroImage} ratio="aspect-auto" className="h-full">
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

  const items = useMemo(
    () => (filter === "all" ? workSamples : workSamples.filter((s) => s.medium === filter)),
    [filter]
  );

  return (
    <section data-frame className="frame bg-paper px-6 lg:px-12">
      <div className="frame-inner flex h-full flex-col">
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

        <div className="mt-[min(2.4svh,1.25rem)] min-h-0 flex-1 overflow-y-auto pb-2 pr-1 [scrollbar-width:thin]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((sample) => {
              const tile = (
                <div className="group overflow-hidden border border-ink/10 bg-ivory">
                  <div className="aspect-[4/5] w-full">
                    <EditorialImage tone={sample.tone} src={sample.image} ratio="aspect-auto" className="h-full" />
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wide-label text-ink">
                      {sample.client}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-ink-soft">{sample.caption}</p>
                    {sample.campaignSlug && (
                      <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide-label text-gold">
                        Full story →
                      </span>
                    )}
                  </div>
                </div>
              );

              return sample.campaignSlug ? (
                <Link key={sample.id} to={`/work/${sample.campaignSlug}`} className="block transition-opacity hover:opacity-90">
                  {tile}
                </Link>
              ) : (
                <div key={sample.id}>{tile}</div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
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
