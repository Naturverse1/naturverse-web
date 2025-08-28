export type MiniQuest = {
  id: string;
  title: string;
  summary: string;
  href: string;
  world: string;
  estMinutes: number;
};

export const MINI_QUESTS: MiniQuest[] = [
  { id: 'tuktuk-dash', title: 'Tuk-Tuk Dash', summary: 'Zip through Bangkok and collect coins.', href: '/play/tuktuk-dash', world: 'Thailandia', estMinutes: 3 },
  { id: 'spice-market', title: 'Spice Market', summary: 'Match flavors and learn Thai spices.', href: '/play/spice-market', world: 'Thailandia', estMinutes: 4 },
  { id: 'temple-trivia', title: 'Temple Trivia', summary: 'Answer quick questions to earn a badge.', href: '/play/temple-trivia', world: 'Thailandia', estMinutes: 2 },
];
