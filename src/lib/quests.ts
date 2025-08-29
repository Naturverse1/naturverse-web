export type Quest = {
  slug: string;
  title: string;
  zone: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  mode?: 'time' | 'score';
};

export const QUESTS: Quest[] = [
  {
    slug: 'tuktuk-dash',
    title: 'Tuk-Tuk Dash',
    zone: 'Bangkok',
    difficulty: 2,
    description: 'Quick reaction game—tap to dodge and collect coins.',
    mode: 'score',
  },
  {
    slug: 'spice-market',
    title: 'Spice Market',
    zone: 'Chiang Mai',
    difficulty: 2,
    description: 'Memory match with Thai spices—find pairs before time runs out.',
    mode: 'time',
  },
  {
    slug: 'temple-trivia',
    title: 'Temple Trivia',
    zone: 'Phuket',
    difficulty: 1,
    description: '3 quick questions about Thai temples and culture.',
    mode: 'score',
  },
];
