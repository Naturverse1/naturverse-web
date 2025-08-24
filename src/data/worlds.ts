export type WorldSlug =
  | 'thailandia'
  | 'chilandia'
  | 'indillandia'
  | 'brazilandia'
  | 'australandia'
  | 'amerilandia';

export type WorldKey = WorldSlug;

export const WORLD_ALIASES: Record<string, WorldSlug> = {
  chinadia: 'chilandia',
  chilandia: 'chilandia',
  indillandia: 'indillandia',
  indilandia: 'indillandia',
};

export type WorldDef = {
  slug: WorldSlug;
  title: string;
  subtitle: string;
  imgSrc: string;
  imgAlt: string;
};

const map = (slug: WorldSlug) => {
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);
  return `/Mapsmain/${name}mapmain.png`;
};

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
    title: 'Chilandia',
    subtitle: 'Bamboo, pandas, lanterns.',
    imgSrc: map('chilandia'),
    imgAlt: 'Chilandia map',
  },
  {
    slug: 'indillandia',
    title: 'Indillandia',
    subtitle: 'Mangoes, tigers, temples.',
    imgSrc: map('indillandia'),
    imgAlt: 'Indillandia map',
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
