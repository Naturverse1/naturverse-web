export const WORLDS = [
  "thailandia",
  "brazilandia",
  "indillandia",
  "amerilandia",
  "australandia",
  "chilandia",
  "japonica",
  "africana",
  "europalia",
  "britannula",
  "kiwilandia",
  "madagascaria",
  "greenlandia",
  "antarctiland",
] as const;

export type WorldKey = typeof WORLDS[number];

