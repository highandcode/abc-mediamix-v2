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

// Real work data lives in ./campaigns.ts (full multi-channel stories) and
// ./samples.ts (standalone single-medium pieces), not here — see
// public/assets/work/README.md for how that material was sourced.

export const siloScenes = [
  { id: "print", label: "Print" },
  { id: "outdoor", label: "Outdoor" },
  { id: "television", label: "Television" },
  { id: "mobile", label: "Mobile" },
  { id: "event", label: "Live" },
  { id: "conversation", label: "Conversation" },
];
