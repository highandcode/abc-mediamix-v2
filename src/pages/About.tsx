import { Link } from "react-router-dom";
import { ecosystemNodes } from "../data/content";
import PageTransition from "../components/editorial/PageTransition";
import PageIndicator from "../components/editorial/PageIndicator";
import EditorialLabel from "../components/editorial/EditorialLabel";
import EditorialImage from "../components/editorial/EditorialImage";
import PullQuote from "../components/editorial/PullQuote";
import StoryReveal from "../components/editorial/StoryReveal";
import GoldThread from "../components/editorial/GoldThread";

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
    <section className="relative bg-ivory px-6 pb-16 pt-32 lg:px-12 lg:pt-44">
      <StoryReveal>
        <EditorialLabel>ABC / ABOUT</EditorialLabel>
      </StoryReveal>
      <StoryReveal delay={90}>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-8xl">
          People who
          <br />
          connect the <span className="text-gold">dots.</span>
        </h1>
      </StoryReveal>
    </section>
  );
}

function Profile() {
  return (
    <section className="relative bg-ivory px-6 pb-24 lg:px-12 lg:pb-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <StoryReveal>
          <EditorialImage tone={0} ratio="aspect-[4/5]" />
        </StoryReveal>
        <StoryReveal delay={100}>
          <PullQuote>
            We don&apos;t organise ourselves around channels. We organise ourselves around the
            idea &mdash; and bring whoever it needs into the room.
          </PullQuote>
          <p className="mt-8 max-w-md text-base leading-relaxed text-ink-soft">
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
    <section className="relative bg-paper px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <StoryReveal>
          <EditorialLabel>HOW WE WORK</EditorialLabel>
        </StoryReveal>
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-3">
          {CULTURE.map((item, i) => (
            <StoryReveal key={item.heading} delay={i * 80}>
              <span className="font-display text-sm font-bold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-ink">
                {item.heading}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </StoryReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function People() {
  return (
    <section className="relative bg-ivory px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <StoryReveal>
          <EditorialLabel>THE DISCIPLINES BEHIND THE IDEA</EditorialLabel>
          <h2 className="mt-3 max-w-lg font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            One roof. Every skill an idea needs.
          </h2>
        </StoryReveal>

        <div className="relative mt-14">
          <GoldThread className="absolute left-0 top-0 hidden h-full lg:block" />
          <ul className="divide-y divide-ink/10 border-y border-ink/10 lg:pl-16">
            {ecosystemNodes.map((node, i) => (
              <li key={node.id}>
                <StoryReveal delay={i * 50}>
                  <div className="flex flex-col gap-3 py-7 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-ink sm:text-3xl">
                      {node.label}
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:max-w-md sm:justify-end">
                      {node.children.map((child) => (
                        <span
                          key={child}
                          className="rounded-full border border-ink/15 px-3 py-1 text-[10px] font-medium uppercase tracking-wide-label text-ink-soft"
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
    <section className="relative border-t border-ink/10 bg-navy px-6 py-24 text-center text-ivory lg:px-12">
      <StoryReveal>
        <p className="mx-auto max-w-lg font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
          Bring us the idea. <span className="text-gold">We&apos;ll bring the rest.</span>
        </p>
      </StoryReveal>
      <StoryReveal delay={100}>
        <Link
          to="/work"
          className="mt-8 inline-flex items-center gap-3 rounded-full border border-ivory/25 px-6 py-3 text-[12px] font-semibold uppercase tracking-wide-label text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          See the stories <span aria-hidden="true">→</span>
        </Link>
      </StoryReveal>
    </section>
  );
}
