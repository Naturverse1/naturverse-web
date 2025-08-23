export type World = {
  slug: string;
  name: string;
  map: string;           // public path to map image
  hero?: string;         // optional hero image
  blurb: string;
};

export const WORLD_DATA: World[] = [
  {
    slug: "thailandia",
    name: "Thailandia",
    map: "/kingdoms/Thailandia/Thailandiamap.jpg",
    blurb: "Coconuts, elephants, festivals.",
  },
  {
    slug: "amerilandia",
    name: "Amerilandia",
    map: "/kingdoms/Amerilandia/Amerilandiamap.png",
    blurb: "Apples & eagles.",
  },
  {
    slug: "indillandia",
    name: "Indillandia",
    map: "/kingdoms/Indillandia/Inlandiamap.png",
    blurb: "Mangoes & tigers.",
  },
  {
    slug: "brazilandia",
    name: "Brazilandia",
    map: "/kingdoms/Brazilandia/Brazilandiamap.png",
    blurb: "Bananas & parrots.",
  },
  {
    slug: "australandia",
    name: "Australandia",
    map: "/kingdoms/Australandia/Australaniamap.png",
    blurb: "Peaches & kangaroos.",
  },
  {
    slug: "chilandia",
    name: "Chilandia",
    map: "/kingdoms/Chilandia/Chilandiamap.jpg",
    blurb: "Bamboo & pandas.",
  },
];

