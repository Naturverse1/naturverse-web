export const slugToFolder: Record<string, string> = {
  thailandia: "Thailandia",
  chilandia: "Chilandia",
  indillandia: "Indillandia",
  brazilandia: "Brazilandia",
  australandia: "Australandia",
  amerilandia: "Amerilandia",
};

export const KINGDOM_FOLDERS = Object.values(slugToFolder) as const;
export type KingdomFolder = (typeof KINGDOM_FOLDERS)[number];
