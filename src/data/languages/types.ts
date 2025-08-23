export type Phrase = { key: string; native: string; roman?: string };
export type NumRow = { value: number; native: string; roman?: string };
export type ColorRow = { en: string; native: string; roman?: string };

export type LangData = {
  slug: string;                 // e.g., "thailandia"
  name: string;                 // e.g., "Thailandia (Thai)"
  nativeName?: string;          // e.g., "ไทย"
  flagPath: string;             // e.g., "/assets/thailandia/flag.png"
  heroPath?: string;            // optional hero image
  phrasebook: Phrase[];
  numbers: NumRow[];
  colors: ColorRow[];
  notes?: string[];
};
