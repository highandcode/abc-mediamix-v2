import { Link, Navigate, useParams } from "react-router-dom";
import { articles, getArticle, issue } from "../data/insights";
import PageTransition from "../components/editorial/PageTransition";
import PageProgress from "../components/editorial/PageProgress";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import PullQuote from "../components/editorial/PullQuote";
import StoryReveal from "../components/editorial/StoryReveal";
import GoldThread from "../components/editorial/GoldThread";

export default function InsightsArticle() {
  const { slug = "" } = useParams();
  const article = getArticle(slug);

  if (!article) return <Navigate to="/insights" replace />;

  const midpoint = Math.ceil(article.body.length / 2);
  const before = article.body.slice(0, midpoint);
  const after = article.body.slice(midpoint);
  const next = articles[(articles.findIndex((a) => a.slug === article.slug) + 1) % articles.length];

  return (
    <PageTransition>
      <PageProgress />
      <PageIndicator label={`ABC / ${article.kicker}`} />

      <article>
        <section className="relative bg-ivory px-6 pb-14 pt-32 lg:px-12 lg:pt-44">
          <div className="mx-auto max-w-3xl">
            <StoryReveal>
              <div className="flex items-center gap-4 text-[11px] font-medium tracking-wide-label text-ink-soft/70">
                <span>{issue.name}</span>
                <span className="h-3 w-px bg-ink/20" />
                <span>{article.kicker}</span>
              </div>
            </StoryReveal>
            <StoryReveal delay={90}>
              <h1 className="mt-5 font-display text-4xl font-extrabold uppercase leading-[0.98] tracking-tight text-ink sm:text-6xl">
                {article.title}
              </h1>
            </StoryReveal>
            <StoryReveal delay={170}>
              <p className="mt-6 font-serif text-xl italic text-ink-soft sm:text-2xl">{article.dek}</p>
            </StoryReveal>
          </div>
        </section>

        <StoryReveal className="mx-auto max-w-5xl px-6 lg:px-12">
          <EditorialImage tone={article.tone} ratio="aspect-[16/9]" caption="ABC EDIT — editorial illustration" />
        </StoryReveal>

        <section className="relative bg-ivory px-6 py-16 lg:px-12">
          <div className="relative mx-auto max-w-3xl">
            <GoldThread className="absolute -left-10 top-0 hidden h-full lg:block" />
            <div className="flex flex-col gap-7">
              {before.map((block, i) => (
                <StoryReveal key={i} delay={i * 40}>
                  <ArticleBlock block={block} />
                </StoryReveal>
              ))}
            </div>

            {after.length > 0 && (
              <>
                <StoryReveal className="my-10">
                  <EditorialImage tone={(article.tone + 2) % 5} ratio="aspect-[16/9]" />
                </StoryReveal>
                <div className="flex flex-col gap-7">
                  {after.map((block, i) => (
                    <StoryReveal key={i} delay={i * 40}>
                      <ArticleBlock block={block} />
                    </StoryReveal>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </article>

      <section className="relative border-t border-ink/10 bg-paper px-6 py-16 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <EditorialLabel>NEXT IN THE EDIT</EditorialLabel>
            <Link
              to={`/insights/${next.slug}`}
              className="mt-2 block font-display text-2xl font-bold text-ink transition-colors hover:text-gold sm:text-3xl"
            >
              {next.title}
            </Link>
          </div>
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide-label text-ink-soft transition-colors hover:text-gold"
          >
            All insights <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}

function ArticleBlock({ block }: { block: { heading?: string; text?: string; quote?: string } }) {
  if (block.quote) return <PullQuote>{block.quote}</PullQuote>;
  return (
    <div>
      {block.heading && (
        <h2 className="mb-3 font-display text-xl font-bold text-ink sm:text-2xl">{block.heading}</h2>
      )}
      {block.text && <p className="text-base leading-relaxed text-ink-soft">{block.text}</p>}
    </div>
  );
}
