import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ecosystemNodes } from "../data/content";
import PageTransition from "../components/editorial/PageTransition";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import PullQuote from "../components/editorial/PullQuote";
import StoryReveal from "../components/editorial/StoryReveal";
import GoldThread from "../components/editorial/GoldThread";

// Every section below is one frame (`data-frame`): one screen tall, and the
// section navigator slides between them. See `.frame` in globals.css.
export default function About() {
  return (
    <PageTransition>
      <PageIndicator label="ABC / ABOUT" />
      <Opener />
      <Profile />
      <Culture />
      <People />
      <Close />
    </PageTransition>
  );
}

function Opener() {
  return (
    <section data-frame className="frame bg-ivory px-6 lg:px-12">
      <div className="frame-inner">
        <StoryReveal>
          <EditorialLabel>ABC / ABOUT</EditorialLabel>
        </StoryReveal>
        <StoryReveal delay={90}>
          <h1
            className="frame-display mt-4 max-w-5xl font-display font-extrabold uppercase tracking-tight text-ink"
            style={{ "--chars": 17 } as CSSProperties}
          >
            People who
            <br />
            connect the <span className="text-gold">dots.</span>
          </h1>
        </StoryReveal>
      </div>
    </section>
  );
}

function Profile() {
  return (
    <section data-frame className="frame bg-ivory px-6 lg:px-12">
      <div className="frame-inner grid grid-cols-1 items-center gap-[min(3svh,1.5rem)] md:grid-cols-[0.8fr_1.2fr] md:gap-12 lg:gap-20">
        <StoryReveal className="md:justify-self-center">
          <div className="h-[24svh] md:h-[min(calc(100svh-var(--nav-h)-5rem),36rem)] md:aspect-[4/5]">
            <EditorialImage tone={0} ratio="aspect-auto" className="h-full" src="/assets/about-billboard.png" />
          </div>
        </StoryReveal>
        <StoryReveal delay={100}>
          <PullQuote className="frame-quote">
            We don&apos;t organise ourselves around channels. We organise ourselves around the
            idea &mdash; and bring whoever it needs into the room.
          </PullQuote>
          <p className="frame-text mt-[min(3svh,2rem)] max-w-md leading-relaxed text-ink-soft">
            No brand needs five agencies to say one thing well. ABC brings strategy, creative,
            media and communications under a single roof, so the idea never loses its shape
            moving between them.
          </p>
        </StoryReveal>
      </div>
    </section>
  );
}

const CULTURE = [
  {
    heading: "We start with the question.",
    body: "Not the deliverable. The brief is a beginning, not an order form.",
  },
  {
    heading: "We think in one thread, not many teams.",
    body: "A single idea moves through every discipline without being handed off and diluted.",
  },
  {
    heading: "We measure what travels.",
    body: "Recognition, not just reach. Response, not just impressions.",
  },
];

function Culture() {
  return (
    <section data-frame className="frame bg-paper px-6 lg:px-12">
      <div className="frame-inner">
        <StoryReveal>
          <EditorialLabel>HOW WE WORK</EditorialLabel>
        </StoryReveal>
        <div className="mt-[min(4svh,2.5rem)] grid grid-cols-1 gap-x-10 gap-y-[min(3svh,2rem)] sm:grid-cols-3">
          {CULTURE.map((item, i) => (
            <StoryReveal key={item.heading} delay={i * 80}>
              <span className="font-display text-sm font-bold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="frame-heading mt-2 font-display font-bold text-ink">{item.heading}</h3>
              <p className="frame-text mt-2 leading-relaxed text-ink-soft">{item.body}</p>
            </StoryReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function People() {
  return (
    <section data-frame className="frame bg-ivory px-6 lg:px-12">
      <div className="frame-inner short:grid short:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] short:items-center short:gap-8">
        <StoryReveal>
          <EditorialLabel>THE DISCIPLINES BEHIND THE IDEA</EditorialLabel>
          <h2
            className="frame-title mt-2 max-w-lg font-display font-extrabold uppercase tracking-tight text-ink"
            style={{ "--chars": 18 } as CSSProperties}
          >
            One roof. Every skill an idea needs.
          </h2>
        </StoryReveal>

        <div className="relative mt-[min(3svh,2rem)] short:mt-0">
          <GoldThread className="absolute left-0 top-0 hidden h-full lg:block" />
          <ul className="divide-y divide-ink/10 border-y border-ink/10 lg:pl-16">
            {ecosystemNodes.map((node, i) => (
              <li key={node.id}>
                <StoryReveal delay={i * 50}>
                  <div className="flex flex-col gap-1 py-[min(1.3svh,0.75rem)] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <h3 className="frame-heading font-display font-bold uppercase tracking-tight text-ink">
                      {node.label}
                    </h3>
                    {/* One quiet line on phones and short landscape; pills otherwise. */}
                    <p className="text-[10px] uppercase tracking-wide-label text-ink-soft sm:hidden short:block">
                      {node.children.join(" · ")}
                    </p>
                    <div className="hidden flex-wrap gap-1.5 sm:flex sm:max-w-md sm:justify-end short:hidden">
                      {node.children.map((child) => (
                        <span
                          key={child}
                          className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide-label text-ink-soft"
                        >
                          {child}
                        </span>
                      ))}
                    </div>
                  </div>
                </StoryReveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section data-frame className="frame items-center border-t border-ink/10 bg-navy px-6 text-center text-ivory lg:px-12">
      <StoryReveal>
        <p
          className="frame-title mx-auto max-w-lg font-display font-extrabold uppercase tracking-tight"
          style={{ "--chars": 16 } as CSSProperties}
        >
          Bring us the idea. <span className="text-gold">We&apos;ll bring the rest.</span>
        </p>
      </StoryReveal>
      <StoryReveal delay={100}>
        <Link
          to="/work"
          className="mt-[min(4svh,2rem)] inline-flex items-center gap-3 rounded-full border border-ivory/25 px-6 py-3 text-[12px] font-semibold uppercase tracking-wide-label text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          See the stories <span aria-hidden="true">→</span>
        </Link>
      </StoryReveal>
    </section>
  );
}
