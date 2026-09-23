export type Medium =
  | "print"
  | "ooh"
  | "television"
  | "digital"
  | "radio"
  | "pr"
  | "stationery"
  | "events";

export const MEDIUM_LABELS: Record<Medium, string> = {
  print: "Print",
  ooh: "Outdoor (OOH)",
  television: "Television",
  digital: "Digital",
  radio: "Radio",
  pr: "PR",
  stationery: "Stationery & Branding",
  events: "Events",
};

export const MEDIUM_ORDER: Medium[] = [
  "print",
  "ooh",
  "television",
  "digital",
  "radio",
  "pr",
  "stationery",
  "events",
];
