export type Base = "Animal" | "Fruit" | "Insect" | "Spirit";

export type Navatar = {
  id: string;
  base: Base;
  species: string;
  name: string;
  emoji: string;
  color: string;
  power: string;
  backstory: string;
  photo?: string;     // data URL (optional)
  createdAt: number;
};
