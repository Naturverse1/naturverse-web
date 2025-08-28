export type QuestStep = {
  id: string;               // stable id for tracking completion
  text: string;             // instruction
  tip?: string;             // optional hint
  minutes?: number;         // suggested time
};

export type Reward = {
  type: "stamp" | "badge" | "xp";
  code: string;             // e.g. "BREATH-STARTER"
  amount?: number;          // e.g. 50 xp
};

export type Quest = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  kingdom?: string;         // optional category tag
  steps: QuestStep[];
  rewards?: Reward[];
  createdAt: string;        // ISO
  updatedAt: string;        // ISO
};

export const SEED_QUESTS: Quest[] = [
  {
    id: "q-breath-001",
    slug: "first-breath",
    title: "First Breath",
    summary: "A gentle 3-step breath practice to calm your body.",
    kingdom: "Air",
    steps: [
      { id: "s1", text: "Sit comfortably and put one hand on your belly.", minutes: 1 },
      { id: "s2", text: "Inhale through your nose for 4, exhale for 6. Repeat 6 times.", tip: "If dizzy, slow down.", minutes: 2 },
      { id: "s3", text: "Notice one thing you feel calmer about.", minutes: 1 }
    ],
    rewards: [{ type: "stamp", code: "AIR-BREATH-START" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
