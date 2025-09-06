export type Navatar = {
  id: string;
  name?: string;
  imageUrl?: string;      // data URL or public URL
  species?: string;
  base?: string;          // Animal | Fruit | Insect | Spirit
  backstory?: string;
  createdAt: number;
};

export type Preset = {
  id: string;
  name: string;
  image: string;          // e.g. /navatars/leaf.png
  category?: string;
};
