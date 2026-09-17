import { workItems } from "./content";

export type CaseStage = {
  label: string;
  heading: string;
  body: string;
};

export type CaseStudy = {
  slug: string;
  index: number;
  title: string;
  teaser: string;
  coverKicker: string;
  coverHeading: string[];
  mediums: string[];
  tone: number;
  stages: {
    brief: CaseStage;
    idea: CaseStage;
    execution: CaseStage;
    impact: CaseStage;
  };
};

const COVER_HEADINGS: Record<string, string[]> = {
  "work-01": ["THE IDEA", "STARTED HERE."],
  "work-02": ["SOME THINGS", "AREN'T MEANT", "TO BE SKIPPED."],
  "work-03": ["A THOUGHT.", "THEN A", "MOVEMENT."],
  "work-04": ["THE COMMENTS", "WERE THE", "CAMPAIGN."],
  "work-05": ["ONE THOUGHT.", "FIVE MEDIUMS.", "ONE THREAD."],
};

const STAGES: Record<string, CaseStudy["stages"]> = {
  "work-01": {
    brief: {
      label: "THE BRIEF",
      heading: "A category nobody wanted to look at twice.",
      body: "The category was tired. The audience had stopped listening. We were asked for attention — we went looking for a reason to earn it.",
    },
    idea: {
      label: "THE IDEA",
      heading: "Say less. Mean more.",
      body: "One line, built to survive being seen for half a second. Everything after it had to protect that single thought.",
    },
    execution: {
      label: "THE EXECUTION",
      heading: "One idea, translated — not repeated.",
      body: "The same thought, said differently everywhere it landed. Never the same asset twice.",
    },
    impact: {
      label: "THE IMPACT",
      heading: "It stopped being an ad. It became a reference point.",
      body: "People started using the line without remembering where they'd heard it first. That's when we knew it had travelled far enough.",
    },
  },
  "work-02": {
    brief: {
      label: "THE BRIEF",
      heading: "A launch window that wouldn't wait.",
      body: "No time for a slow build. The idea had to arrive fully formed, in every place the audience already was.",
    },
    idea: {
      label: "THE IDEA",
      heading: "Make the pause impossible.",
      body: "Not louder — just harder to scroll past. A single visual tension, held across every format.",
    },
    execution: {
      label: "THE EXECUTION",
      heading: "Built for the feed, the street, and the newsroom — at once.",
      body: "Timed to land everywhere within the same 48 hours, so no single sighting felt like the whole story.",
    },
    impact: {
      label: "THE IMPACT",
      heading: "The coverage carried it further than the media plan did.",
      body: "Earned attention outpaced paid reach within the first week — the idea did work the budget hadn't planned for.",
    },
  },
  "work-03": {
    brief: {
      label: "THE BRIEF",
      heading: "A quiet truth, buried under category noise.",
      body: "Everyone in the space was shouting the same claim. We went looking for the one nobody had said plainly yet.",
    },
    idea: {
      label: "THE IDEA",
      heading: "Let the audience finish the sentence.",
      body: "An open thought, deliberately incomplete — designed to be picked up, not just watched.",
    },
    execution: {
      label: "THE EXECUTION",
      heading: "Seeded small. Let it travel on its own terms.",
      body: "We planted it in fewer places than usual, and let people carry it the rest of the way.",
    },
    impact: {
      label: "THE IMPACT",
      heading: "It outgrew the campaign that started it.",
      body: "The line kept appearing long after the media plan ended — repurposed, remixed, and still unmistakably the same idea.",
    },
  },
  "work-04": {
    brief: {
      label: "THE BRIEF",
      heading: "A brand that needed to be talked about, not talked at.",
      body: "Broadcasting the message wasn't the job. Starting a conversation the audience wanted to join was.",
    },
    idea: {
      label: "THE IDEA",
      heading: "Ask the question. Don't answer it.",
      body: "We built the opening line and left space for the audience's response to complete the story.",
    },
    execution: {
      label: "THE EXECUTION",
      heading: "The brand spoke once. The audience did the rest.",
      body: "Every subsequent execution was shaped by what people were already saying back.",
    },
    impact: {
      label: "THE IMPACT",
      heading: "The replies became the most-shared part of the campaign.",
      body: "What started as a comments section became the loudest room in the conversation.",
    },
  },
  "work-05": {
    brief: {
      label: "THE BRIEF",
      heading: "One message, four very different audiences.",
      body: "Each medium had its own expectations. The idea had to hold its shape in all of them, without repeating itself.",
    },
    idea: {
      label: "THE IDEA",
      heading: "One thread. Many knots.",
      body: "A single visual motif, reinterpreted for outdoor, television, digital and live — never diluted, never identical.",
    },
    execution: {
      label: "THE EXECUTION",
      heading: "Sequenced, not scattered.",
      body: "Each medium picked up where the last left off, so the audience experienced one unfolding idea, not five separate ads.",
    },
    impact: {
      label: "THE IMPACT",
      heading: "Recognition without repetition.",
      body: "Audiences could name the campaign after seeing only one execution — the thread held, wherever it appeared.",
    },
  },
};

export const caseStudies: CaseStudy[] = workItems.map((item, i) => ({
  slug: item.id.replace("work-", "story-"),
  index: i + 1,
  title: item.title,
  teaser: item.teaser,
  coverKicker: `ABC / ${String(i + 1).padStart(2, "0")}`,
  coverHeading: COVER_HEADINGS[item.id] ?? [item.title.toUpperCase()],
  mediums: item.mediums,
  tone: i % 5,
  stages: STAGES[item.id],
}));

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug) ?? null;
}
