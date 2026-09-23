export type EcosystemNode = {
  id: string;
  label: string;
  angle: number;
  children: string[];
};

export const ecosystemNodes: EcosystemNode[] = [
  {
    id: "strategy",
    label: "Strategy",
    angle: -90,
    children: ["Brand Strategy", "Audience Insight", "Media Planning"],
  },
  {
    id: "creative",
    label: "Creative",
    angle: -30,
    children: ["Art Direction", "Film & Content", "Design Systems"],
  },
  {
    id: "media",
    label: "Media",
    angle: 30,
    children: ["Print", "Television", "Radio", "Outdoor", "Digital"],
  },
  {
    id: "pr",
    label: "PR & Comms",
    angle: 90,
    children: ["Media Relations", "Corporate Comms", "Reputation"],
  },
  {
    id: "experiences",
    label: "Experiences",
    angle: 150,
    children: ["Events", "Activations", "Brand Spaces"],
  },
  {
    id: "data",
    label: "Data",
    angle: 210,
    children: ["Analytics", "Attribution", "Optimisation"],
  },
];

export type WorkItem = {
  id: string;
  title: string;
  teaser: string;
  mediums: string[];
  /** Campaign key visual (portrait-leaning, subject in the upper-middle). */
  image: string;
};

export const workItems: WorkItem[] = [
  {
    id: "work-01",
    image: "/assets/work/work-01.jpg",
    title: "A story that started with one idea.",
    teaser: "It didn't begin in a media plan.",
    mediums: ["Strategy", "Film", "Outdoor", "Social"],
  },
  {
    id: "work-02",
    image: "/assets/work/work-02.jpg",
    title: "The campaign people couldn't ignore.",
    teaser: "Some things aren't meant to be skipped.",
    mediums: ["Television", "PR", "Digital"],
  },
  {
    id: "work-03",
    image: "/assets/work/work-03.jpg",
    title: "From a thought to a movement.",
    teaser: "It travelled further than the media plan said it would.",
    mediums: ["Print", "Experiences", "Social"],
  },
  {
    id: "work-04",
    image: "/assets/work/work-04.jpg",
    title: "Conversations that counted.",
    teaser: "The comments were the campaign.",
    mediums: ["PR", "Digital", "Radio"],
  },
  {
    id: "work-05",
    image: "/assets/work/work-05.jpg",
    title: "An idea that travelled far.",
    teaser: "One thought, five mediums, one thread.",
    mediums: ["Outdoor", "Television", "Digital", "Events"],
  },
];

export const siloScenes = [
  { id: "print", label: "Print" },
  { id: "outdoor", label: "Outdoor" },
  { id: "television", label: "Television" },
  { id: "mobile", label: "Mobile" },
  { id: "event", label: "Live" },
  { id: "conversation", label: "Conversation" },
];
