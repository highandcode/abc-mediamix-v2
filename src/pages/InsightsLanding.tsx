import { Link } from "react-router-dom";
import { articles, issue } from "../data/insights";
import PageTransition from "../components/editorial/PageTransition";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import StoryReveal from "../components/editorial/StoryReveal";

export default function InsightsLanding() {
  const cover = articles.find((a) => a.size === "cover")!;
  const rest = articles.filter((a) => a.slug !== cover.slug);
  const features = rest.filter((a) => a.size === "feature");
  const briefs = rest.filter((a) => a.size === "brief");

  return (
    <PageTransition>
      <PageIndicator label="ABC / INSIGHTS" />

      <section className="relative bg-ivory px-6 pb-10 pt-32 lg:px-12 lg:pt-40">
        <div className="mx-auto max-w-[1440px]">
          <StoryReveal>
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/10 pb-6">
              <span className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                {issue.name}
              </span>
              <div className="flex items-center gap-4 text-[11px] font-medium tracking-wide-label text-ink-soft">
                <span>{issue.issue}</span>
                <span className="h-3 w-px bg-ink/20" />
                <span>{issue.date}</span>
              </div>
            </div>
          </StoryReveal>
        </div>
      </section>

      {/* Cover story */}
      <section className="relative bg-ivory px-6 pb-20 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <Link to={`/insights/${cover.slug}`} className="group grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <StoryReveal>
              <EditorialImage tone={cover.tone} ratio="aspect-[4/3]" />
            </StoryReveal>
            <StoryReveal delay={100} className="flex flex-col justify-center">
              <EditorialLabel>{cover.kicker}</EditorialLabel>
              <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.98] tracking-tight text-ink transition-colors group-hover:text-gold sm:text-6xl">
                {cover.title}
              </h1>
              <p className="mt-5 max-w-md font-serif text-lg italic text-ink-soft">{cover.dek}</p>
              <span className="mt-6 inline-flex w-fit items-center gap-2 text-[11px] font-semibold uppercase tracking-wide-label text-gold">
                Read the story <span aria-hidden="true">→</span>
              </span>
            </StoryReveal>
          </Link>
        </div>
      </section>

      {/* Feature stories — asymmetric editorial grid, not blog cards */}
      <section className="relative bg-paper px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
            {features.map((article, i) => (
              <StoryReveal key={article.slug} delay={i * 80} className={i === 0 ? "lg:mt-16" : ""}>
                <Link to={`/insights/${article.slug}`} className="group block">
                  <EditorialImage tone={article.tone} ratio="aspect-[16/10]" />
                  <div className="mt-5">
                    <EditorialLabel>{article.kicker}</EditorialLabel>
                    <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-ink transition-colors group-hover:text-gold sm:text-3xl">
                      {article.title}
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-ink-soft">{article.dek}</p>
                  </div>
                </Link>
              </StoryReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Briefs — short-form, editorial list */}
      <section className="relative bg-ivory px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <StoryReveal>
            <EditorialLabel>IN BRIEF</EditorialLabel>
          </StoryReveal>
          <ol className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {briefs.map((article, i) => (
              <li key={article.slug}>
                <StoryReveal delay={i * 60}>
                  <Link
                    to={`/insights/${article.slug}`}
                    className="group flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <div>
                      <EditorialLabel>{article.kicker}</EditorialLabel>
                      <h3 className="mt-2 font-display text-xl font-bold text-ink transition-colors group-hover:text-gold sm:text-2xl">
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
