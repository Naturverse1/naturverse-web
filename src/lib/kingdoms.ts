export type KingdomSlug =
  | "thailandia"
  | "chilandia"
  | "indillandia"
  | "brazilandia"
  | "australandia"
  | "amerilandia";

export const SLUG_TO_FOLDER: Record<KingdomSlug, string> = {
  thailandia: "Thailandia",
  chilandia: "Chilandia",
  indillandia: "Indillandia",
  brazilandia: "Brazilandia",
  australandia: "Australandia",
  amerilandia: "Amerilandia",
};

export function titleFromSlug(slug: KingdomSlug) {
  return SLUG_TO_FOLDER[slug];
}

export type Manifest = {
  characters: { file: string; name?: string }[];
};
