export type WorldSlug =
  | 'thailandia'
  | 'chilandia'
  | 'indilandia'
  | 'brazilandia'
  | 'australandia'
  | 'amerilandia';

export type WorldKey = WorldSlug;

export const WORLD_ALIASES: Record<string, WorldSlug> = {
  chinadia: 'chilandia',
  chilandia: 'chilandia',
  indillandia: 'indilandia',
  indilandia: 'indilandia',
};

export type WorldDef = {
  slug: WorldSlug;
  title: string;
  subtitle: string;
  imgSrc: string;
  imgAlt: string;
};

const map = (slug: WorldSlug) => `/Mapsmain/${slug}mapmain.png`;

export const WORLDS: WorldDef[] = [
  {
    slug: 'thailandia',
    title: 'Thailandia',
    subtitle: 'Coconuts, elephants, festivals.',
    imgSrc: map('thailandia'),
    imgAlt: 'Thailandia map',
  },
  {
    slug: 'chilandia',
    title: 'Chilandia (Mandarin)',
    subtitle: 'Bamboo, pandas, lanterns.',
    imgSrc: map('chilandia'),
    imgAlt: 'Chilandia map',
  },
  {
    slug: 'indilandia',
    title: 'Indilandia (Hindi)',
    subtitle: 'Mangoes, tigers, temples.',
    imgSrc: map('indilandia'),
    imgAlt: 'Indilandia map',
  },
  {
    slug: 'brazilandia',
    title: 'Brazilandia',
    subtitle: 'Rainforests, parrots, beaches.',
    imgSrc: map('brazilandia'),
    imgAlt: 'Brazilandia map',
  },
  {
    slug: 'australandia',
    title: 'Australandia',
    subtitle: 'Peaches, kangaroos, reefs.',
    imgSrc: map('australandia'),
    imgAlt: 'Australandia map',
  },
  {
    slug: 'amerilandia',
    title: 'Amerilandia',
    subtitle: 'Apples, eagles, canyons.',
    imgSrc: map('amerilandia'),
    imgAlt: 'Amerilandia map',
  },
];

export const getWorldBySlug = (raw: string) => {
  const normalized = (WORLD_ALIASES[raw] ?? raw) as WorldSlug;
  return WORLDS.find(w => w.slug === normalized) ?? null;
};
