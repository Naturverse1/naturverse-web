export type World = {
  slug: string;
  title: string;
  blurb: string;
  hero?: string; // optional image path
};

export const WORLDS: World[] = [
  { slug: "thailandia",   title: "Thailandia",   blurb: "Coconuts, elephants, festivals.",   hero: "/assets/thailandia/Thailandiamap.jpg" },
  { slug: "brazilandia",  title: "Brazilandia",  blurb: "Rainforests, parrots, beaches.",    hero: "/assets/brazilandia/Brazilandiamap.png" },
  { slug: "indilandia",   title: "Indilandia",   blurb: "Mangoes, tigers, temples.",         hero: "/assets/indilandia/Indilandiamap.png" },
  { slug: "amerilandia",  title: "Amerilandia",  blurb: "Apples, eagles, canyons.",          hero: "/assets/amerilandia/Amerilandiamap.png" },
  { slug: "australandia", title: "Australandia", blurb: "Peaches, kangaroos, reefs.",        hero: "/assets/australandia/Australandiamap.png" },
  { slug: "chilandia",    title: "Chilandia",    blurb: "Bamboo, pandas, lanterns.",         hero: "/assets/chilandia/Chilandiamap.png" },
  // add more later
];

export const WORLD_SLUGS = WORLDS.map(w => w.slug) as const;
export type WorldKey = typeof WORLD_SLUGS[number];
