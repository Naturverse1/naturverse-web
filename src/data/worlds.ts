export type World = {
  slug: string;
  title: string;
  blurb: string;
};

export const WORLDS: World[] = [
  { slug: "thailandia",   title: "Thailandia",   blurb: "Coconuts, elephants, festivals." },
  { slug: "brazilandia",  title: "Brazilandia",  blurb: "Rainforests, parrots, beaches." },
  { slug: "indilandia",   title: "Indilandia",   blurb: "Mangoes, tigers, temples." },
  { slug: "amerilandia",  title: "Amerilandia",  blurb: "Apples, eagles, canyons." },
  { slug: "australandia", title: "Australandia", blurb: "Peaches, kangaroos, reefs." },
  { slug: "chilandia",    title: "Chilandia",    blurb: "Bamboo, pandas, lanterns." },
  // add more later
];

export const WORLD_SLUGS = WORLDS.map(w => w.slug) as const;
export type WorldKey = typeof WORLD_SLUGS[number];
