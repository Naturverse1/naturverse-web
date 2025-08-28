import { Quest, QuestStep } from "./quests";

export type QuestTemplate = {
  key: string;
  title: string;
  summary: string;
  kingdom?: string;
  steps: QuestStep[];
  rewards?: Quest["rewards"];
};

export const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    key: "breath-basics",
    title: "Breath Basics",
    summary: "Three calm breaths to reset your body and mind.",
    kingdom: "Air",
    steps: [
      { id: "t1", text: "Sit tall. One hand on chest, one on belly.", minutes: 1 },
      { id: "t2", text: "Inhale 4, exhale 6. Repeat 6 times.", tip: "If dizzy, slow down.", minutes: 2 },
      { id: "t3", text: "Notice one thing that feels easier now.", minutes: 1 }
    ],
    rewards: [{ type: "stamp", code: "AIR-BREATH-START" }]
  },
  {
    key: "focus-3-2-1",
    title: "Focus 3-2-1",
    summary: "A quick sensory scan to bring attention to now.",
    kingdom: "Mind",
    steps: [
      { id: "t1", text: "Name 3 things you can see." },
      { id: "t2", text: "Name 2 sounds you can hear." },
      { id: "t3", text: "Name 1 thing you can feel (touch)." }
    ],
    rewards: [{ type: "xp", code: "FOCUS-XP", amount: 25 }]
  },
  {
    key: "courage-mini-dare",
    title: "Courage Mini-Dare",
    summary: "A tiny brave action to train your courage muscle.",
    kingdom: "Fire",
    steps: [
      { id: "t1", text: "Pick a tiny dare (smile at a stranger / ask a question)." },
      { id: "t2", text: "Do it within 2 minutes—no overthinking!", minutes: 2 },
      { id: "t3", text: "Write one sentence about how it went." }
    ],
    rewards: [{ type: "badge", code: "BRAVE-SPARK" }]
  }
];

