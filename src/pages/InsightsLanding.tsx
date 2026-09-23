import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { articles, issue } from "../data/insights";
import PageTransition from "../components/editorial/PageTransition";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import StoryReveal from "../components/editorial/StoryReveal";

// Every section below is one frame (`data-frame`): one screen tall, and the
// section navigator slides between them. See `.frame` in globals.css.
export default function InsightsLanding() {
  const cover = articles.find((a) => a.size === "cover")!;
  const rest = articles.filter((a) => a.slug !== cover.slug);
  const features = rest.filter((a) => a.size === "feature");
  const briefs = rest.filter((a) => a.size === "brief");

  return (
    <PageTransition>
      <PageIndicator label="ABC / INSIGHTS" />

      {/* Masthead + cover story */}
      <section data-frame className="frame bg-ivory px-6 lg:px-12">
        <div className="frame-inner">
          <StoryReveal>
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/10 pb-[min(2svh,1rem)]">
              <span className="font-display text-base font-extrabold uppercase tracking-tight text-ink sm:text-lg">
                {issue.name}
              </span>
              <div className="flex items-center gap-4 text-[11px] font-medium tracking-wide-label text-ink-soft">
                <span>{issue.issue}</span>
                <span className="h-3 w-px bg-ink/20" />
                <span>{issue.date}</span>
              </div>
            </div>
          </StoryReveal>

          <Link
            to={`/insights/${cover.slug}`}
            className="group mt-[min(3svh,2rem)] grid grid-cols-1 gap-[min(3svh,1.5rem)] lg:grid-cols-2 lg:items-center lg:gap-16 short:grid-cols-2 short:items-center short:gap-8"
          >
            <StoryReveal>
              <div className="h-[22svh] lg:h-[min(calc(100svh-var(--nav-h)-11rem),30rem)] short:h-[calc(100svh-var(--nav-h)-6rem)]">
                <EditorialImage tone={cover.tone} ratio="aspect-auto" className="h-full" />
              </div>
            </StoryReveal>
            <StoryReveal delay={100} className="flex flex-col justify-center">
              <EditorialLabel>{cover.kicker}</EditorialLabel>
              <h1
                className="frame-title mt-[min(1.8svh,1rem)] font-display font-extrabold uppercase tracking-tight text-ink transition-colors group-hover:text-gold"
                style={{ "--chars": 13 } as CSSProperties}
              >
                {cover.title}
              </h1>
              <p className="frame-text mt-[min(2svh,1.25rem)] max-w-md font-serif italic text-ink-soft">{cover.dek}</p>
              <span className="mt-[min(2.4svh,1.5rem)] inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-wide-label text-gold">
                Read the story <span aria-hidden="true">→</span>
              </span>
            </StoryReveal>
          </Link>
        </div>
      </section>

      {/* Feature stories — asymmetric editorial grid, not blog cards */}
      <section data-frame className="frame bg-paper px-6 lg:px-12">
        <div className="frame-inner grid grid-cols-1 gap-x-12 gap-y-[min(3svh,1.5rem)] sm:grid-cols-2">
          {features.map((article, i) => (
            <StoryReveal key={article.slug} delay={i * 80}>
              <Link to={`/insights/${article.slug}`} className="group block">
                <div className="h-[13svh] sm:h-[clamp(80px,calc(var(--frame-h)-11rem),380px)]">
                  <EditorialImage tone={article.tone} ratio="aspect-auto" className="h-full" />
                </div>
                <div className="mt-[min(2svh,1.25rem)]">
                  <EditorialLabel>{article.kicker}</EditorialLabel>
                  <h2 className="frame-heading mt-2 font-display font-bold text-ink transition-colors group-hover:text-gold">
                    {article.title}
                  </h2>
                  <p className="frame-text mt-2 max-w-sm text-ink-soft">{article.dek}</p>
                </div>
              </Link>
            </StoryReveal>
          ))}
        </div>
      </section>

      {/* Briefs — short-form, editorial list */}
      <section data-frame className="frame bg-ivory px-6 lg:px-12">
        <div className="frame-inner">
          <StoryReveal>
            <EditorialLabel>IN BRIEF</EditorialLabel>
          </StoryReveal>
          <ol className="mt-[min(3svh,2rem)] divide-y divide-ink/10 border-y border-ink/10">
            {briefs.map((article, i) => (
              <li key={article.slug}>
                <StoryReveal delay={i * 60}>
                  <Link
                    to={`/insights/${article.slug}`}
                    className="group flex flex-col gap-2 py-[min(3.5svh,2.5rem)] sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <div>
                      <EditorialLabel>{article.kicker}</EditorialLabel>
                      <h3
                        className="frame-title mt-2 font-display font-bold tracking-tight text-ink transition-colors group-hover:text-gold"
                        style={{ "--chars": 24 } as CSSProperties}
                      >
                        {article.title}
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wide-label text-ink-soft opacity-0 transition-opacity group-hover:opacity-100 sm:shrink-0">
                      Read <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </StoryReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageTransition>
  );
}
