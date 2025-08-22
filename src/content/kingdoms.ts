export type Kingdom = {
  key: string;       // folder & route label, e.g. "Thailandia"
  title: string;     // display name
  subtitle: string;  // the small caption already on Worlds
};

export const KINGDOMS: Kingdom[] = [
  { key: "Thailandia",    title: "Thailandia",    subtitle: "Coconuts & Elephants" },
  { key: "Brazilandia",   title: "Brazilandia",   subtitle: "Bananas & Parrots" },
  { key: "Indilandia",    title: "Indilandia",    subtitle: "Mangoes & Tigers" },
  { key: "Amerilandia",   title: "Amerilandia",   subtitle: "Apples & Eagles" },
  { key: "Australandia",  title: "Australandia",  subtitle: "Peaches & Kangaroos" },
  { key: "Chilandia",     title: "Chilandia",     subtitle: "Bamboo & Pandas" },
  { key: "Japonica",      title: "Japonica",      subtitle: "Cherry Blossoms & Foxes" },
  { key: "Africania",     title: "Africania",     subtitle: "Mangoes & Lions" },
  { key: "Europalia",     title: "Europalia",     subtitle: "Sunflowers & Hedgehogs" },
  { key: "Britannula",    title: "Britannula",    subtitle: "Roses & Hedgehogs" },
  { key: "Kiwilandia",    title: "Kiwilandia",    subtitle: "Kiwis & Sheep" },
  { key: "Madagascaria",  title: "Madagascaria",  subtitle: "Lemons & Lemurs" },
  { key: "Greenlandia",   title: "Greenlandia",   subtitle: "Ice & Polar Bears" },
  { key: "Antarcticland", title: "Antarcticland", subtitle: "Ice Crystals & Penguins" },
];
