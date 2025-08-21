export type NavatarBase = "Animal" | "Fruit" | "Insect" | "Spirit";

export type Navatar = {
  id: string;             // nano id (timestamp-based string)
  name: string;
  base: NavatarBase;
  species: string;        // e.g., “Red Panda”, “Mango”, …
  backstory: string;
  powers: string[];       // short list of powers/traits
  imageDataUrl?: string;  // optional uploaded photo (data URL)
  createdAt: number;      // epoch ms
};
