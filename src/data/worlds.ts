export type Kingdom = {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  img?: string; // optional branded image path
};

export const WORLDS: Kingdom[] = [
  { id: "thailandia", name: "Thailandia", tagline: "Coconuts & Elephants", emoji: "🐘🌸", img: "/assets/kingdoms/thailandia.jpg" },
  { id: "brazilandia", name: "Brazilandia", tagline: "Bananas & Parrots", emoji: "🍌🦜" },
  { id: "indillandia", name: "Indillandia", tagline: "Mangoes & Tigers", emoji: "🥭🐯" },
  { id: "amerilandia", name: "Amerilandia", tagline: "Apples & Eagles", emoji: "🍎🦅" },
  { id: "australandia", name: "Australandia", tagline: "Peaches & Kangaroos", emoji: "🍑🦘" },
  { id: "chilandia", name: "Chilandia", tagline: "Bamboo (shoots) & Pandas", emoji: "🎋🐼" },
  { id: "japonica", name: "Japonica", tagline: "Cherry Blossoms & Foxes", emoji: "🌸🦊" },
  { id: "africana", name: "Africana", tagline: "Mangoes & Lions", emoji: "🦁🌞" },
  { id: "europalia", name: "Europalia", tagline: "Sunflowers & Hedgehogs", emoji: "🌻🦔" },
  { id: "britannula", name: "Britannula", tagline: "Roses & Hedgehogs", emoji: "🌹🦔" },
  { id: "kiwilandia", name: "Kiwilandia", tagline: "Kiwis & Sheep", emoji: "🥝🐑" },
  { id: "madagascaria", name: "Madagascaria", tagline: "Lemons & Lemurs", emoji: "🍋🦥" },
  { id: "greenlandia", name: "Greenlandia", tagline: "Ice & Polar Bears", emoji: "🧊🐻‍❄️" },
  { id: "antarctiland", name: "Antarctiland", tagline: "Ice Crystals & Penguins", emoji: "❄️🐧" },
];
