export type Navatar = {
  id: string; // stable id
  name: string;
  base?: "Animal" | "Fruit" | "Insect" | "Spirit" | string;
  species?: string;
  emoji?: string;
  img?: string;   // URL or data URI
  rarity?: "Common" | "Rare" | "Epic" | "Legendary";
  priceCents?: number;
  priceNatur?: number;
};
