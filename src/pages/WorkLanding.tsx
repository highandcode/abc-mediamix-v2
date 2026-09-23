import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/editorial/PageTransition";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import StoryReveal from "../components/editorial/StoryReveal";
import GoldThread from "../components/editorial/GoldThread";
import PageIndicator from "../components/editorial/PageIndicator";
import { caseStudies } from "../data/work";

// Every section below is one frame (`data-frame`): one screen tall, and the
// section navigator slides between them. See `.frame` in globals.css.
export default function WorkLanding() {
  const [cover, ...rest] = caseStudies;

  return (
    <PageTransition>
      <PageIndicator label="ABC / STORIES" />

      <section data-frame className="frame bg-ivory px-6 lg:px-12">
        <div className="frame-inner">
          <StoryReveal>
            <EditorialLabel>ABC / STORIES</EditorialLabel>
          </StoryReveal>
          <StoryReveal delay={80}>
            <h1
              className="frame-display mt-4 max-w-5xl font-display font-extrabold uppercase tracking-tight text-ink"
              style={{ "--chars": 16 } as CSSProperties}
            >
              The stories
              <br />
              behind the <span className="text-gold">impact.</span>
            </h1>
          </StoryReveal>
          <StoryReveal delay={160}>
            <p className="mt-[min(3svh,1.5rem)] max-w-sm font-serif text-lg italic text-ink-soft sm:text-xl">
              Ideas are only the beginning.
            </p>
          </StoryReveal>
        </div>
      </section>

      {/* Editorial cover — the first story, treated like a magazine feature */}
      <section data-frame className="frame bg-ivory px-6 lg:px-12">
        <div className="frame-inner grid grid-cols-1 gap-[min(3svh,1.5rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 short:grid-cols-[0.9fr_1.1fr] short:items-center short:gap-8">
          <div>
            <StoryReveal>
              <div className="flex items-baseline justify-between border-t border-ink/10 pt-[min(2svh,1rem)]">
                <EditorialLabel>{cover.coverKicker}</EditorialLabel>
                <span className="hidden text-[11px] tracking-wide-label text-ink-soft/60 sm:inline">
                  FEATURED STORY
                </span>
              </div>
            </StoryReveal>
            <StoryReveal delay={100}>
              <h2
                className="frame-title mt-[min(2.4svh,1.5rem)] font-display font-extrabold uppercase tracking-tight text-ink"
                style={{ "--chars": 14 } as CSSProperties}
              >
                {cover.coverHeading.map((line, i) => (
                  <span key={i} className="block">
                    {i === cover.coverHeading.length - 1 ? <span className="text-gold">{line}</span> : line}
                  </span>
                ))}
              </h2>
            </StoryReveal>
            <StoryReveal delay={180}>
              <p className="frame-text mt-[min(2.4svh,1.5rem)] max-w-sm leading-relaxed text-ink-soft">{cover.teaser}</p>
            </StoryReveal>
          </div>

          <StoryReveal delay={120}>
            <Link
              to={`/work/${cover.slug}`}
              className="group block h-[28svh] lg:h-[min(calc(100svh-var(--nav-h)-5rem),34rem)] short:h-[calc(100svh-var(--nav-h)-3rem)]"
            >
              <EditorialImage tone={cover.tone} src={cover.image} ratio="aspect-auto" className="h-full">
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                  <span className="font-display text-xs font-semibold uppercase tracking-wide-label text-ivory/80 sm:text-sm">
                    {cover.title}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full bg-ivory/95 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide-label text-ink transition-transform group-hover:scale-105 group-hover:bg-gold group-hover:text-ivory">
                    Open the story
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </EditorialImage>
            </Link>
          </StoryReveal>
        </div>
      </section>

      {/* The rest of the stories — an editorial index, not a portfolio grid */}
      <section data-frame className="frame bg-paper px-6 lg:px-12">
        <div className="frame-inner">
          <div className="relative">
            <GoldThread className="absolute left-0 top-0 hidden h-full lg:block" height="100%" />
            <ol className="divide-y divide-ink/10 border-y border-ink/10 lg:pl-16">
              {rest.map((item, i) => (
                <li key={item.slug}>
                  <Link
                    to={`/work/${item.slug}`}
                    className="group grid grid-cols-[auto_1fr] items-center gap-4 py-[min(2.2svh,1.5rem)] sm:grid-cols-[auto_1fr_auto] sm:gap-10"
                  >
                    <StoryReveal delay={i * 60}>
                      <span className="font-display text-[clamp(1.5rem,5svh,3rem)] font-bold leading-none text-ink-soft/30 transition-colors group-hover:text-gold">
                        {String(item.index).padStart(2, "0")}
                      </span>
                    </StoryReveal>

                    <StoryReveal delay={i * 60 + 60}>
                      <h3 className="frame-heading font-display font-bold text-ink transition-colors group-hover:text-gold">
                        {item.title}
                      </h3>
                      <p className="frame-text mt-1 max-w-md text-ink-soft">{item.teaser}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5 short:hidden [@media(max-height:700px)]:hidden">
                        {item.mediums.slice(0, 2).map((m) => (
                          <span
                            key={m}
                            className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide-label text-ink-soft"
                          >
                            {m}
                          </span>
                        ))}
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide-label text-ink-soft/50">
                          +{item.mediums.length - 2 > 0 ? item.mediums.length - 2 : item.mediums.length} more
                        </span>
                      </div>
                    </StoryReveal>

                    <StoryReveal
                      delay={i * 60 + 100}
                      className="hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-wide-label text-gold opacity-0 transition-opacity group-hover:opacity-100 sm:flex sm:justify-self-end"
                    >
                      Open the story <span aria-hidden="true">→</span>
                    </StoryReveal>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <StoryReveal className="mt-[min(3svh,1.5rem)] text-center short:hidden">
            <p className="text-sm text-ink-soft">More stories, always in motion.</p>
          </StoryReveal>
        </div>
      </section>
    </PageTransition>
  );
}
