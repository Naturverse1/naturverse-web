export type Quest = {
  slug: 'tuktuk-dash' | 'spice-market' | 'temple-trivia';
  title: string;
  blurb: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  zone: 'Bangkok' | 'Chiang Mai' | 'Phuket';
};

export const MINI_QUESTS: Quest[] = [
  {
    slug: 'tuktuk-dash',
    title: 'Tuk-Tuk Dash',
    blurb: 'Quick reaction game—tap to dodge and collect coins.',
    difficulty: 2,
    zone: 'Bangkok',
  },
  {
    slug: 'spice-market',
    title: 'Spice Market',
    blurb: 'Memory match with Thai spices—find pairs before time runs out.',
    difficulty: 2,
    zone: 'Chiang Mai',
  },
  {
    slug: 'temple-trivia',
    title: 'Temple Trivia',
    blurb: '3 quick questions about Thai temples and culture.',
    difficulty: 1,
    zone: 'Phuket',
  },
];
