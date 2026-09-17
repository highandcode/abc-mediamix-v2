import { Link } from "react-router-dom";
import PageTransition from "../components/editorial/PageTransition";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import StoryReveal from "../components/editorial/StoryReveal";
import GoldThread from "../components/editorial/GoldThread";
import PageIndicator from "../components/editorial/PageIndicator";
import { caseStudies } from "../data/work";

export default function WorkLanding() {
  const [cover, ...rest] = caseStudies;

  return (
    <PageTransition>
      <PageIndicator label="ABC / STORIES" />

      <section className="relative bg-ivory px-6 pb-20 pt-32 lg:px-12 lg:pt-44">
        <div className="mx-auto max-w-[1440px]">
          <StoryReveal>
            <EditorialLabel>ABC / STORIES</EditorialLabel>
          </StoryReveal>
          <StoryReveal delay={80}>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-8xl">
              The stories
              <br />
              behind the <span className="text-gold">impact.</span>
            </h1>
          </StoryReveal>
          <StoryReveal delay={160}>
            <p className="mt-6 max-w-sm font-serif text-xl italic text-ink-soft">
              Ideas are only the beginning.
            </p>
          </StoryReveal>
        </div>
      </section>

      {/* Editorial cover — the first story, treated like a magazine feature */}
      <section className="relative bg-ivory px-6 pb-24 lg:px-12 lg:pb-36">
        <div className="mx-auto max-w-[1440px]">
          <StoryReveal>
            <div className="flex items-baseline justify-between border-t border-ink/10 pt-6">
              <EditorialLabel>{cover.coverKicker}</EditorialLabel>
              <span className="hidden text-[11px] tracking-wide-label text-ink-soft/60 sm:inline">
                FEATURED STORY
              </span>
            </div>
          </StoryReveal>

          <div className="mt-8 grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <StoryReveal delay={100}>
              <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                {cover.coverHeading.map((line, i) => (
                  <span key={i} className="block">
                    {i === cover.coverHeading.length - 1 ? (
                      <span className="text-gold">{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                ))}
              </h2>
            </StoryReveal>
            <StoryReveal delay={180}>
              <p className="max-w-sm text-base leading-relaxed text-ink-soft">{cover.teaser}</p>
            </StoryReveal>
          </div>

          <StoryReveal delay={120} className="mt-10">
            <Link to={`/work/${cover.slug}`} className="group block">
              <EditorialImage tone={cover.tone} ratio="aspect-[16/9]">
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
                  <span className="font-display text-sm font-semibold uppercase tracking-wide-label text-ivory/80">
                    {cover.title}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full bg-ivory/95 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide-label text-ink transition-transform group-hover:scale-105 group-hover:bg-gold group-hover:text-ivory">
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
      <section className="relative bg-paper px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="relative">
            <GoldThread className="absolute left-0 top-0 hidden h-full lg:block" height="100%" />
            <ol className="divide-y divide-ink/10 border-y border-ink/10 lg:pl-16">
              {rest.map((item, i) => (
                <li key={item.slug}>
                  <Link
                    to={`/work/${item.slug}`}
                    className="group grid grid-cols-1 items-center gap-6 py-10 sm:grid-cols-[auto_1fr_auto] sm:gap-10"
                  >
                    <StoryReveal delay={i * 60} className="flex items-baseline gap-4 sm:block">
                      <span className="font-display text-3xl font-bold text-ink-soft/30 transition-colors group-hover:text-gold sm:text-5xl">
                        {String(item.index).padStart(2, "0")}
                      </span>
                    </StoryReveal>

                    <StoryReveal delay={i * 60 + 60}>
                      <h3 className="font-display text-2xl font-bold leading-snug text-ink transition-colors group-hover:text-gold sm:text-3xl lg:text-4xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm text-ink-soft">{item.teaser}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.mediums.slice(0, 2).map((m) => (
                          <span
                            key={m}
                            className="rounded-full border border-ink/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide-label text-ink-soft"
                          >
                            {m}
                          </span>
                        ))}
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide-label text-ink-soft/50">
                          +{item.mediums.length - 2 > 0 ? item.mediums.length - 2 : item.mediums.length} more
                        </span>
                      </div>
                    </StoryReveal>

                    <StoryReveal
                      delay={i * 60 + 100}
                      className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide-label text-gold opacity-0 transition-opacity group-hover:opacity-100 sm:justify-self-end"
                    >
                      Open the story <span aria-hidden="true">→</span>
                    </StoryReveal>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <StoryReveal className="mt-14 text-center">
            <p className="text-sm text-ink-soft">More stories, always in motion.</p>
          </StoryReveal>
        </div>
      </section>
    </PageTransition>
  );
}
