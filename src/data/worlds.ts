export type World = {
  slug: string;
  name: string;
  map: string;           // public path to map image
  hero?: string;         // optional hero image
  blurb: string;
};

export const WORLDS: World[] = [
  { slug: "thailandia",   name: "Thailandia",   map: "/assets/thailandia/map.png",   blurb: "Coconuts, elephants, festivals." },
  { slug: "amerilandia",  name: "Amerilandia",  map: "/assets/amerilandia/map.png",  blurb: "Apples & eagles." },
  { slug: "indilandia",   name: "Indilandia",   map: "/assets/indilandia/map.png",   blurb: "Mangoes & tigers." },
  { slug: "brazilandia",  name: "Brazilandia",  map: "/assets/brazilandia/map.png",  blurb: "Bananas & parrots." },
  { slug: "australandia", name: "Australandia", map: "/assets/australandia/map.png", blurb: "Peaches & kangaroos." },
  { slug: "chilandia",    name: "Chilandia",    map: "/assets/chilandia/map.png",    blurb: "Bamboo & pandas." }
];
