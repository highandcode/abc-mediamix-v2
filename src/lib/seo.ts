import type { Campaign } from "../data/campaigns";
import type { Article } from "../data/insights";
import { issue } from "../data/insights";

/** Production domain — always used for canonical/OG/sitemap URLs, never a Vercel preview host. */
export const SITE_URL = "https://abcmediamix.com";
export const SITE_NAME = "ABC Mediamix";
const LOGO_PATH = "/assets/abc-logo-master.png";
const DEFAULT_OG_IMAGE = `${SITE_URL}${LOGO_PATH}`;

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  robots?: string;
  ogType?: "website" | "article";
  jsonLd: object[];
};

function canonical(path: string) {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "AUGUST 2026" -> "2026-08-01" — format normalization of the real issue date, not a fabricated per-article date. */
function issueDateISO(): string {
  const parsed = new Date(`${issue.date.split(" ")[0]} 1, ${issue.date.split(" ")[1]}`);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  email: "info@abcmediamix.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office No. 1002, Vikrant Tower, Rajendra Place",
    addressLocality: "New Delhi",
    postalCode: "110008",
    addressCountry: "IN",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

function webPageJsonLd(path: string, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonical(path),
  };
}

function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

const HOME_META: PageMeta = {
  path: "/",
  title: "ABC Mediamix | Ideas, Media & Impact",
  description:
    "ABC Mediamix is an integrated advertising, media and communications agency — connecting strategy, creative, media planning and PR around a single idea.",
  jsonLd: [organizationJsonLd, websiteJsonLd, webPageJsonLd("/", "ABC Mediamix", "Ideas, Media & Impact.")],
};

const WORK_META: PageMeta = {
  path: "/work",
  title: "Work & Campaigns | ABC Mediamix",
  description:
    "Case studies in integrated advertising and media — ideas built to travel across television, print, outdoor, digital and PR.",
  jsonLd: [webPageJsonLd("/work", "Work & Campaigns | ABC Mediamix", "The stories behind the impact.")],
};

const APPROACH_META: PageMeta = {
  path: "/approach",
  title: "Our Approach | Integrated Advertising & Media Solutions | ABC Mediamix",
  description:
    "How ABC Mediamix connects strategy, creative, media planning and communications around one idea, from brief to impact.",
  jsonLd: [webPageJsonLd("/approach", "Our Approach | ABC Mediamix", "How ABC thinks.")],
};

const ABOUT_META: PageMeta = {
  path: "/about",
  title: "About ABC Mediamix | Ideas, Media & Impact",
  description:
    "ABC Mediamix brings strategy, creative, media and PR under one roof — the disciplines behind every integrated campaign.",
  jsonLd: [webPageJsonLd("/about", "About ABC Mediamix", "People who connect the dots.")],
};

const INSIGHTS_META: PageMeta = {
  path: "/insights",
  title: "Insights | Advertising, Media & Communication | ABC Mediamix",
  description:
    "ABC EDIT — perspectives on advertising, media planning, PR and brand communication from ABC Mediamix.",
  jsonLd: [webPageJsonLd("/insights", "Insights | ABC Mediamix", "ABC EDIT — advertising, media and communication perspectives.")],
};

const CONTACT_META: PageMeta = {
  path: "/contact",
  title: "Contact ABC Mediamix | Let's Build What's Next",
  description:
    "Start a conversation with ABC Mediamix about your next integrated advertising, media or communications campaign.",
  jsonLd: [webPageJsonLd("/contact", "Contact ABC Mediamix", "Every idea starts somewhere.")],
};

const NOT_FOUND_META: PageMeta = {
  path: "/404",
  title: "Page Not Found | ABC Mediamix",
  description: "This page doesn't exist. Return to ABC Mediamix.",
  robots: "noindex, follow",
  jsonLd: [],
};

export function getWorkMeta(campaign: Campaign): PageMeta {
  const path = `/work/${campaign.slug}`;
  const title = `${campaign.client} | ABC Mediamix`;
  return {
    path,
    title,
    description: campaign.teaser,
    ogType: "article",
    jsonLd: [
      webPageJsonLd(path, title, campaign.teaser),
      breadcrumbJsonLd([
        { name: "ABC Mediamix", path: "/" },
        { name: "Work", path: "/work" },
        { name: campaign.client, path },
      ]),
    ],
  };
}

export function getInsightMeta(article: Article): PageMeta {
  const path = `/insights/${article.slug}`;
  const title = `${article.title} | ABC EDIT | ABC Mediamix`;
  const datePublished = issueDateISO();
  return {
    path,
    title,
    description: article.dek,
    ogType: "article",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.dek,
        ...(datePublished ? { datePublished } : {}),
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE },
        },
        mainEntityOfPage: canonical(path),
        image: DEFAULT_OG_IMAGE,
      },
      breadcrumbJsonLd([
        { name: "ABC Mediamix", path: "/" },
        { name: "Insights", path: "/insights" },
        { name: article.title, path },
      ]),
    ],
  };
}

export function getRouteMeta(
  pathname: string,
  data: { campaigns: Campaign[]; articles: Article[] }
): PageMeta {
  const path = pathname === "" ? "/" : pathname;

  switch (path) {
    case "/":
      return HOME_META;
    case "/work":
      return WORK_META;
    case "/approach":
      return APPROACH_META;
    case "/about":
      return ABOUT_META;
    case "/insights":
      return INSIGHTS_META;
    case "/contact":
      return CONTACT_META;
  }

  const workMatch = path.match(/^\/work\/([^/]+)\/?$/);
  if (workMatch) {
    const campaign = data.campaigns.find((c) => c.slug === workMatch[1]);
    if (campaign) return getWorkMeta(campaign);
  }

  const insightMatch = path.match(/^\/insights\/([^/]+)\/?$/);
  if (insightMatch) {
    const article = data.articles.find((a) => a.slug === insightMatch[1]);
    if (article) return getInsightMeta(article);
  }

  return NOT_FOUND_META;
}

/**
 * Single source of truth for every non-title head tag a page needs. Consumed
 * both by `buildHeadHtml` (server-rendered HTML string) and by the client's
 * `usePageMeta` hook (imperative DOM tags on route change) so the two can
 * never drift apart or duplicate a tag.
 */
export type MetaTagSpec =
  | { tag: "link"; attrs: Record<string, string> }
  | { tag: "meta"; attrs: Record<string, string> }
  | { tag: "script"; attrs: Record<string, string>; text: string };

export function getMetaTagSpecs(meta: PageMeta): MetaTagSpec[] {
  const url = canonical(meta.path);
  const robots = meta.robots ?? "index, follow";
  const ogType = meta.ogType ?? "website";

  return [
    { tag: "link", attrs: { rel: "canonical", href: url } },
    { tag: "meta", attrs: { name: "description", content: meta.description } },
    { tag: "meta", attrs: { name: "robots", content: robots } },
    { tag: "meta", attrs: { property: "og:type", content: ogType } },
    { tag: "meta", attrs: { property: "og:site_name", content: SITE_NAME } },
    { tag: "meta", attrs: { property: "og:title", content: meta.title } },
    { tag: "meta", attrs: { property: "og:description", content: meta.description } },
    { tag: "meta", attrs: { property: "og:url", content: url } },
    { tag: "meta", attrs: { property: "og:image", content: DEFAULT_OG_IMAGE } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: meta.title } },
    { tag: "meta", attrs: { name: "twitter:description", content: meta.description } },
    { tag: "meta", attrs: { name: "twitter:image", content: DEFAULT_OG_IMAGE } },
    ...meta.jsonLd.map((entry) => ({
      tag: "script" as const,
      attrs: { type: "application/ld+json" },
      text: JSON.stringify(entry),
    })),
  ];
}

export function buildHeadHtml(meta: PageMeta): string {
  const tagsHtml = getMetaTagSpecs(meta)
    .map((spec) => {
      const attrsHtml = Object.entries(spec.attrs)
        .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
        .join(" ");
      if (spec.tag === "script") return `<script ${attrsHtml}>${spec.text}</script>`;
      return `<${spec.tag} ${attrsHtml} />`;
    })
    .join("\n    ");

  return `<title>${escapeHtml(meta.title)}</title>\n    ${tagsHtml}`;
}
