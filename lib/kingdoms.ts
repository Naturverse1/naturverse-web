export const KINGDOM_FOLDERS = [
  "Amerilandia",
  "Australandia",
  "Brazilandia",
  "Chilandia",
  "Indillandia",
  "Thailandia",
] as const;

export type KingdomFolder = (typeof KINGDOM_FOLDERS)[number];

/** Map route slug -> exact folder name in /public/kingdoms */
export function slugToKingdomFolder(slug: string): KingdomFolder {
  const map: Record<string, KingdomFolder> = {
    amerilandia: "Amerilandia",
    australandia: "Australandia",
    brazilandia: "Brazilandia",
    chilandia: "Chilandia",
    indillandia: "Indillandia",
    thailandia: "Thailandia",
  };
  return map[slug] as KingdomFolder;
}
