import type { Medium } from "./mediums";

/**
 * Standalone, single-medium samples of real work — each one a genuine piece
 * for a real client (or, where noted, our own studio's own material). These
 * are proof of work: the client's own branding stays as it was made, only
 * the presentation/staging changes. See public/assets/work/README.md.
 */
export type WorkSample = {
  id: string;
  client: string;
  medium: Medium;
  caption: string;
  image: string;
  /** EditorialImage gradient-fallback index, shown until the image loads. */
  tone?: number;
  /** Set when this piece is also part of a full campaign story under /work/:slug. */
  campaignSlug?: string;
};

export const workSamples: WorkSample[] = [
  {
    id: "apollo-hospitals-print",
    client: "Apollo Hospitals",
    medium: "print",
    caption: "Full-page press ad — internationally trained doctors campaign",
    image: "/assets/work/samples/print/apollo-hospitals.png",
    tone: 2,
  },
  {
    id: "delhi-apartments-print",
    client: "Delhi Apartments — Deep Ganga",
    medium: "print",
    caption: "Newspaper ad for a Haridwar residential launch",
    image: "/assets/work/samples/print/delhi-apartments-deep-ganga-print.jpg",
    tone: 2,
  },
  {
    id: "delhi-apartments-ooh",
    client: "Delhi Apartments — Deep Ganga",
    medium: "ooh",
    caption: "Roadside hoarding, photographed as installed",
    image: "/assets/work/samples/ooh/delhi-apartments-deep-ganga-hoarding-graded.jpg",
    tone: 0,
  },
  {
    id: "omaxe-tv",
    client: "Omaxe",
    medium: "television",
    caption: "10-second corporate TVC",
    image: "/assets/work/samples/television/omaxe-tvc.jpg",
    tone: 0,
  },
  {
    id: "supertech-tv",
    client: "Supertech",
    medium: "television",
    caption: "Real-estate TVC, Noida",
    image: "/assets/work/samples/television/supertech-tvc.jpg",
    tone: 0,
  },
  {
    id: "abc-legacy-digital-1",
    client: "ABC Mediamix (est. as Sensation Design Studio)",
    medium: "digital",
    caption: "Our own studio site, from the archives",
    image: "/assets/work/samples/digital/abc-legacy-web-1.png",
    tone: 0,
  },
  {
    id: "abc-legacy-digital-2",
    client: "ABC Mediamix (est. as Sensation Design Studio)",
    medium: "digital",
    caption: "Our own studio site, an earlier layout",
    image: "/assets/work/samples/digital/abc-legacy-web-2.png",
    tone: 0,
  },
  {
    id: "auto-race-radio",
    client: "Auto Race Day",
    medium: "radio",
    caption: "30-second radio promo",
    image: "/assets/work/samples/radio/auto-race-day-promo.jpg",
    tone: 0,
  },
  {
    id: "lic-radio",
    client: "LIC",
    medium: "radio",
    caption: "Radio spot, take 3",
    image: "/assets/work/samples/radio/lic-spot-3.jpg",
    tone: 0,
  },
  {
    id: "dainik-jagran-pr",
    client: "Sensation × Chandel Advertising",
    medium: "pr",
    caption: "Press coverage secured for a talent-hunt audition event",
    image: "/assets/work/samples/pr/dainik-jagran-sensation-feature.jpg",
    tone: 2,
  },
  {
    id: "miracle-events-1",
    client: "Miracle Events & Entertainment",
    medium: "stationery",
    caption: "Visiting card design",
    image: "/assets/work/samples/stationery/miracle-events-1.png",
    tone: 0,
  },
  {
    id: "miracle-events-2",
    client: "Miracle Events & Entertainment",
    medium: "stationery",
    caption: "Visiting card design, alternate run",
    image: "/assets/work/samples/stationery/miracle-events-2.png",
    tone: 0,
  },
  {
    id: "pcs-appliances-stationery",
    client: "PCS Appliances",
    medium: "stationery",
    caption: "Business card, two layout options",
    image: "/assets/work/samples/stationery/pcs-appliances.png",
    tone: 0,
  },
  {
    id: "ghsimr-kosmos-events",
    client: "GHSIMR — Kosmos",
    medium: "events",
    caption: "Inter-college management fest identity",
    image: "/assets/work/samples/events/ghsimr-kosmos.png",
    tone: 0,
  },
  {
    id: "gniot-cultural-meet",
    client: "GNIOT",
    medium: "events",
    caption: "Annual cultural meet",
    image: "/assets/work/samples/events/gniot-cultural-meet.jpg",
    tone: 3,
  },

  // AVJ Group — part of the full campaign story, see campaigns.ts
  {
    id: "avj-tv",
    client: "AVJ Group",
    medium: "television",
    caption: "AVJ Tower corporate TVC",
    image: "/assets/work/campaigns/avj/avj-hero-graded.jpg",
    tone: 0,
    campaignSlug: "avj",
  },
  {
    id: "avj-print",
    client: "AVJ Group",
    medium: "print",
    caption: "AVJ Tower full-page newspaper ad",
    image: "/assets/work/campaigns/avj/avj-print-graded.jpg",
    tone: 2,
    campaignSlug: "avj",
  },
  {
    id: "avj-flap",
    client: "AVJ Group",
    medium: "print",
    caption: "Illustrated flap-front collateral",
    image: "/assets/work/campaigns/avj/avj-tower-flap.jpg",
    tone: 2,
    campaignSlug: "avj",
  },
  {
    id: "avj-magazine",
    client: "AVJ Group",
    medium: "print",
    caption: "Magazine spread covering the group's three live projects",
    image: "/assets/work/campaigns/avj/avj-magazine-staged.jpg",
    tone: 2,
    campaignSlug: "avj",
  },
  {
    id: "avj-brochure",
    client: "AVJ Group",
    medium: "print",
    caption: "AVJ Platinum brochure cover",
    image: "/assets/work/campaigns/avj/avj-brochure-staged.jpg",
    tone: 2,
    campaignSlug: "avj",
  },
  {
    id: "avj-pr",
    client: "AVJ Group",
    medium: "pr",
    caption: "Mail Today feature covering an AVJ Platinum launch event",
    image: "/assets/work/campaigns/avj/avj-pr-staged.jpg",
    tone: 2,
    campaignSlug: "avj",
  },
  {
    id: "avj-events",
    client: "AVJ Group",
    medium: "events",
    caption: "3D launch-event stage design",
    image: "/assets/work/campaigns/avj/avj-events-graded.jpg",
    tone: 0,
    campaignSlug: "avj",
  },
  {
    id: "avj-events-alt",
    client: "AVJ Group",
    medium: "events",
    caption: "3D launch-event stage design, alternate concept",
    image: "/assets/work/campaigns/avj/avj-events-alt-graded.jpg",
    tone: 0,
    campaignSlug: "avj",
  },

  // Cyberwalk (Aarone Group) — part of the full campaign story, see campaigns.ts
  {
    id: "cyberwalk-tv",
    client: "Aarone Group — Cyberwalk",
    medium: "television",
    caption: "15-second TVC",
    image: "/assets/work/campaigns/cyberwalk/cyberwalk-tv-graded.jpg",
    tone: 0,
    campaignSlug: "cyberwalk",
  },
  {
    id: "cyberwalk-magazine-night",
    client: "Aarone Group — Cyberwalk",
    medium: "print",
    caption: "Magazine ad, night skyline treatment",
    image: "/assets/work/campaigns/cyberwalk/cyberwalk-hero-graded.jpg",
    tone: 0,
    campaignSlug: "cyberwalk",
  },
  {
    id: "cyberwalk-magazine-day",
    client: "Aarone Group — Cyberwalk",
    medium: "print",
    caption: "Magazine ad, daylight treatment",
    image: "/assets/work/campaigns/cyberwalk/cyberwalk-magazine-day-graded.jpg",
    tone: 2,
    campaignSlug: "cyberwalk",
  },
  {
    id: "cyberwalk-flap",
    client: "Aarone Group — Cyberwalk",
    medium: "print",
    caption: "Newspaper flap-front creative",
    image: "/assets/work/campaigns/cyberwalk/cyberwalk-print-graded.jpg",
    tone: 2,
    campaignSlug: "cyberwalk",
  },
  {
    id: "cyberwalk-emailer-1",
    client: "Aarone Group — Cyberwalk",
    medium: "digital",
    caption: "Investor e-mailer",
    image: "/assets/work/campaigns/cyberwalk/emailer-1.jpg",
    tone: 2,
    campaignSlug: "cyberwalk",
  },
  {
    id: "cyberwalk-emailer-2",
    client: "Aarone Group — Cyberwalk",
    medium: "digital",
    caption: "Investor e-mailer, alternate send",
    image: "/assets/work/campaigns/cyberwalk/emailer-2.jpg",
    tone: 2,
    campaignSlug: "cyberwalk",
  },
  {
    id: "cyberwalk-web-illustration",
    client: "Aarone Group — Cyberwalk",
    medium: "digital",
    caption: "Illustrated web creative",
    image: "/assets/work/campaigns/cyberwalk/web-illustration.jpg",
    tone: 2,
    campaignSlug: "cyberwalk",
  },
];

export const getSamplesByMedium = (medium: Medium) => workSamples.filter((s) => s.medium === medium);
export const getSamplesForCampaign = (slug: string) => workSamples.filter((s) => s.campaignSlug === slug);
