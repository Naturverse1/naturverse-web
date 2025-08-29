// Simple source of truth for stock. You can replace with Supabase later.
export type Stock = { sku: string; qty: number; lowAt?: number };
const DEFAULT_LOW_AT = 5;

// Default demo stock (edit anytime)
const STOCK: Record<string, Stock> = {
  "navatar-style-kit": { sku: "navatar-style-kit", qty: 9999 }, // digital = unlimited
  "breathwork-starter": { sku: "breathwork-starter", qty: 9999 },
  "naturverse-plushie": { sku: "naturverse-plushie", qty: 8, lowAt: 5 },
  "naturverse-tshirt":  { sku: "naturverse-tshirt",  qty: 3, lowAt: 4 },
  "sticker-pack":       { sku: "sticker-pack",       qty: 0, lowAt: 5 }, // show Sold out
  "seed-journal":       { sku: "seed-journal",       qty: 12, lowAt: 5 },
};

export function getStock(sku: string): Stock | null { return STOCK[sku] ?? null; }
export function isDigital(sku: string) {
  return sku === "navatar-style-kit" || sku === "breathwork-starter";
}
