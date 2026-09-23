import { getSamplesForCampaign } from "./samples";

export type CaseStage = {
  label: string;
  heading: string;
  body: string;
};

/**
 * A full multi-channel story — real work for one real client, spanning
 * several genuine mediums. Kept to the handful of clients where the
 * archive actually shows that breadth; everything else lives as a
 * standalone WorkSample in the medium-filterable gallery instead of being
 * stretched into a narrative it never had. See MEMORY: work-assets-proof-vs-brand.
 */
export type Campaign = {
  slug: string;
  index: number;
  client: string;
  coverKicker: string;
  coverHeading: string[];
  teaser: string;
  heroImage: string;
  /** CSS object-position for heroImage, for a source whose subject isn't centered. */
  heroFocalPoint?: string;
  tone: number;
  stages: {
    brief: CaseStage;
    idea: CaseStage;
    execution: CaseStage;
    impact: CaseStage;
  };
};

export const campaigns: Campaign[] = [
  {
    slug: "avj",
    index: 1,
    client: "AVJ Group",
    coverKicker: "ABC / 01",
    coverHeading: ["ONE IDENTITY.", "SIX MEDIUMS.", "ONE ADDRESS."],
    teaser:
      "A Delhi-NCR real-estate group building three projects at once — carried by the same identity across newsprint, magazine, brochure, TV, PR and a launch stage.",
    heroImage: "/assets/work/campaigns/avj/avj-hero-graded.jpg",
    tone: 0,
    stages: {
      brief: {
        label: "THE BRIEF",
        heading: "Three live projects. One name people needed to trust.",
        body: "AVJ Tower, AVJ Heightss and AVJ Homes were all moving at once — different sites, different buyers, same young developer asking to be taken seriously in a crowded Greater Noida market.",
      },
      idea: {
        label: "THE IDEA",
        heading: "Say it the same way, everywhere it's said.",
        body: "One mark, one tone, one promise — 'big the investment, bigger the return' — carried without variation across every surface the group touched, so three projects read as one credible developer.",
      },
      execution: {
        label: "THE EXECUTION",
        heading: "Print, magazine, brochure, TV, PR and a launch stage.",
        body: "Full-page newspaper ads, a magazine spread covering all three projects, a Platinum apartments brochure, a corporate TVC, press coverage of a launch event, and two 3D stage designs for that same event.",
      },
      impact: {
        label: "THE WORK",
        heading: "Six mediums. The same building, every time.",
        body: "The tower render on the newspaper page is the same one on the brochure cover, the same one on the TV spot, the same one lit up on the launch stage — a small developer reading like an established one.",
      },
    },
  },
  {
    slug: "cyberwalk",
    index: 2,
    client: "Aarone Group — Cyberwalk",
    coverKicker: "ABC / 02",
    coverHeading: ["THE GREENER", "PASTURES,", "PROVEN."],
    teaser:
      "An IT park in Manesar, competing for attention against established Gurgaon addresses — sold on credentials, not just renders, across TV, print, magazine, email and web.",
    heroImage: "/assets/work/campaigns/cyberwalk/cyberwalk-hero-graded.jpg",
    heroFocalPoint: "center 78%",
    tone: 0,
    stages: {
      brief: {
        label: "THE BRIEF",
        heading: "A new address, next to addresses people already trusted.",
        body: "Cyberwalk needed to hold its own against Gurgaon's established commercial belt — with construction still underway and no track record of its own yet to point to.",
      },
      idea: {
        label: "THE IDEA",
        heading: "Lead with who's already there, not just what's coming.",
        body: "Every execution opened with the same credibility markers — a LEED Gold certification, a 150-acre IT hub, tenants like Agilent, Nestlé and HCL already signed — before it ever asked for a booking.",
      },
      execution: {
        label: "THE EXECUTION",
        heading: "A day version and a night version, for every room in the plan.",
        body: "A 15-second TVC, two magazine treatments of the same skyline — daylight and dusk — a newspaper flap-front, investor e-mailers and an illustrated web creative, all carrying the same 'greener pastures' mark.",
      },
      impact: {
        label: "THE WORK",
        heading: "One identity, six formats, zero repetition.",
        body: "The same tower reads as a bright daytime render in a newspaper and a dramatic lit skyline in a magazine — the same building, doing two different jobs, without ever looking like two different campaigns.",
      },
    },
  },
];

export function getCampaign(slug: string) {
  return campaigns.find((c) => c.slug === slug) ?? null;
}

export { getSamplesForCampaign };
