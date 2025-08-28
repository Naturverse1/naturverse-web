export type Zone = {
  slug: string;
  name: string;
  emoji: string;
  region: string;
  summary: string;
};

export const ZONES: Zone[] = [
  {
    slug: "golden-grove",
    name: "Golden Grove",
    emoji: "🌳",
    region: "Thailandia",
    summary: "Ancient durian forests where Turian first appeared."
  },
  {
    slug: "lotus-lake",
    name: "Lotus Lake",
    emoji: "🌸",
    region: "Thailandia",
    summary: "A tranquil water realm guarded by Princess Non Bua."
  },
  {
    slug: "spicy-hills",
    name: "Spicy Hills",
    emoji: "🌶️",
    region: "Thailandia",
    summary: "Chili Chaa’s fiery homeland, training ground of warriors."
  },
  {
    slug: "jungle-trails",
    name: "Jungle Trails",
    emoji: "🐘",
    region: "Thailandia",
    summary: "Elephant guardians roam here, keeping balance in the wild."
  },
  {
    slug: "royal-canopy",
    name: "Royal Canopy",
    emoji: "👑",
    region: "Thailandia",
    summary: "Seat of the Durian King and Queen, high among banyans."
  }
];
