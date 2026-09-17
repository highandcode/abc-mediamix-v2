export type Article = {
  slug: string;
  kicker: string;
  title: string;
  dek: string;
  tone: number;
  size: "cover" | "feature" | "brief";
  body: { heading?: string; text?: string; quote?: string }[];
};

export const issue = {
  name: "ABC EDIT",
  issue: "ISSUE 01",
  date: "AUGUST 2026",
};

export const articles: Article[] = [
  {
    slug: "attention-isnt-enough",
    kicker: "THE COVER STORY",
    title: "Why attention isn't enough anymore.",
    dek: "Every brand can be seen. Fewer can be remembered. Fewer still can be believed.",
    tone: 0,
    size: "cover",
    body: [
      {
        text: "For a decade, the industry optimised for one metric: did they see it? The answer was almost always yes. Impressions were never the problem — impact was.",
      },
      {
        heading: "The attention economy has a supply problem.",
        text: "There is more content competing for the same eight seconds than at any point in advertising history. Winning that window no longer means winning the audience.",
      },
      {
        quote: "An idea that only earns attention has done half its job.",
      },
      {
        heading: "What travels isn't the loudest idea. It's the clearest one.",
        text: "The campaigns that outlive their media plans share one trait: they gave the audience something worth repeating, not just something worth noticing.",
      },
      {
        text: "That's the shift we design for — not a louder single moment, but an idea built to keep moving after the media budget stops paying for it.",
      },
    ],
  },
  {
    slug: "the-cost-of-a-good-brief",
    kicker: "PROCESS",
    title: "The real cost of a good brief.",
    dek: "Most campaigns don't fail in execution. They fail three weeks earlier, in a room nobody remembers.",
    tone: 1,
    size: "feature",
    body: [
      { text: "A weak brief is rarely obvious at the time. It reads clearly, it has a deadline, it has a budget line. What it doesn't have is a question worth answering." },
      { heading: "Start with the question, not the deliverable.", text: "Every brief that has produced work worth remembering began with a question the team didn't already know the answer to." },
      { text: "The deliverable comes later. If you start there, you inherit someone else's assumptions instead of finding your own idea." },
    ],
  },
  {
    slug: "media-plans-are-not-ideas",
    kicker: "MEDIA",
    title: "A media plan is not an idea.",
    dek: "Channels are where an idea travels. They were never meant to be where it's born.",
    tone: 2,
    size: "feature",
    body: [
      { text: "It's an easy trap: build the plan first, then find something to put in it. The work that lasts happens in the opposite order." },
      { heading: "Start with where the idea belongs — not where the budget is biggest.", text: "Some ideas are built for a fifteen-second film. Others only work as a single line on a hoarding. The idea decides the medium, not the other way round." },
    ],
  },
  {
    slug: "silence-as-strategy",
    kicker: "CREATIVE",
    title: "Silence as a strategy.",
    dek: "Sometimes the most effective thing a brand can do is leave a sentence unfinished.",
    tone: 3,
    size: "brief",
    body: [
      { text: "Audiences don't just consume ideas — they complete them. The campaigns that get talked about are often the ones that leave room to." },
    ],
  },
  {
    slug: "what-earned-really-means",
    kicker: "PR & COMMS",
    title: "What 'earned' actually means.",
    dek: "Not free media. Media the idea deserved.",
    tone: 4,
    size: "brief",
    body: [
      { text: "Earned coverage isn't a lucky byproduct of a paid plan — it's evidence the idea was strong enough to move on its own." },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug) ?? null;
}
