import type { CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { articles, getArticle, issue } from "../data/insights";
import { chunkArticle, type ArticleBlock } from "../lib/chunkArticle";
import PageTransition from "../components/editorial/PageTransition";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import PullQuote from "../components/editorial/PullQuote";
import StoryReveal from "../components/editorial/StoryReveal";

// Every section below is one frame (`data-frame`): one screen tall, and the
// section navigator slides between them. The body is split into frames by
// `chunkArticle`, with the second image between the halves.
export default function InsightsArticle() {
  const { slug = "" } = useParams();
  const article = getArticle(slug);

  if (!article) return <Navigate to="/insights" replace />;

  const chunks = chunkArticle(article.body);
  const imageAfter = chunks.length > 1 ? Math.ceil(chunks.length / 2) : -1;
  const next = articles[(articles.findIndex((a) => a.slug === article.slug) + 1) % articles.length];

  return (
    <PageTransition>
      <PageIndicator label={`ABC / ${article.kicker}`} />

      <article>
        <section data-frame className="frame bg-ivory px-6 lg:px-12">
          <div className="frame-inner grid grid-cols-1 gap-[min(3svh,1.5rem)] md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-12 short:grid-cols-[1.1fr_0.9fr] short:items-center short:gap-8">
            <div>
              <StoryReveal>
                <div className="flex items-center gap-4 text-[11px] font-medium tracking-wide-label text-ink-soft/70">
                  <span>{issue.name}</span>
                  <span className="h-3 w-px bg-ink/20" />
                  <span>{article.kicker}</span>
                </div>
              </StoryReveal>
              <StoryReveal delay={90}>
                <h1
                  className="frame-title mt-[min(2.4svh,1.25rem)] font-display font-extrabold uppercase tracking-tight text-ink"
                  style={{ "--chars": 13 } as CSSProperties}
                >
                  {article.title}
                </h1>
              </StoryReveal>
              <StoryReveal delay={170}>
                <p className="frame-text mt-[min(2.4svh,1.5rem)] max-w-md font-serif italic text-ink-soft">
                  {article.dek}
                </p>
              </StoryReveal>
            </div>
            <StoryReveal delay={120}>
              <div className="h-[18svh] md:h-[min(calc(100svh-var(--nav-h)-5rem),30rem)] short:h-[calc(100svh-var(--nav-h)-3rem)]">
                <EditorialImage tone={article.tone} src={article.image} ratio="aspect-auto" className="h-full" />
              </div>
            </StoryReveal>
          </div>
        </section>

        {chunks.map((blocks, i) => (
          <ArticleFrames
            key={i}
            blocks={blocks}
            image={i + 1 === imageAfter ? { tone: article.tone, src: article.image } : null}
          />
        ))}
      </article>

      <section data-frame className="frame items-center border-t border-ink/10 bg-paper px-6 lg:px-12">
        <div className="frame-inner flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <EditorialLabel>NEXT IN THE EDIT</EditorialLabel>
            <Link
              to={`/insights/${next.slug}`}
              className="frame-title mt-2 block max-w-2xl font-display font-bold text-ink transition-colors hover:text-gold"
              style={{ "--chars": 24 } as CSSProperties}
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

/** One frame of body copy, followed by an image-only frame when `image` is set. */
function ArticleFrames({
  blocks,
  image,
}: {
  blocks: ArticleBlock[];
  image: { tone: number; src: string } | null;
}) {
  return (
    <>
      <section data-frame className="frame bg-ivory px-6 lg:px-12">
        <div className="frame-inner">
          <div className="mx-auto flex max-w-3xl flex-col gap-[min(3.5svh,1.75rem)] border-l border-gold/40 pl-5 sm:pl-8 short:max-w-none short:grid short:grid-cols-2 short:gap-8">
            {blocks.map((block, i) => (
              <StoryReveal key={i} delay={i * 80}>
                <ArticleBlockView block={block} />
              </StoryReveal>
            ))}
          </div>
        </div>
      </section>
      {image && (
        <section data-frame className="frame bg-ivory px-6 lg:px-12">
          <div className="frame-inner">
            <StoryReveal>
              <div className="mx-auto h-[min(calc(100svh-var(--nav-h)-5rem),34rem)] max-w-5xl">
                <EditorialImage tone={image.tone} src={image.src} ratio="aspect-auto" className="h-full" />
              </div>
            </StoryReveal>
          </div>
        </section>
      )}
    </>
  );
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.quote) return <PullQuote className="frame-quote">{block.quote}</PullQuote>;
  return (
    <div>
      {block.heading && <h2 className="frame-heading mb-2 font-display font-bold text-ink">{block.heading}</h2>}
      {block.text && <p className="frame-text leading-relaxed text-ink-soft">{block.text}</p>}
    </div>
  );
}
