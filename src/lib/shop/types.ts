export type Money = { amount: number; currency: "USD" | "NATUR" };
export type Item = {
  id: string;
  name: string;
  desc: string;
  price: Money;
  image?: string; // optional URL or emoji fallback
  tag?: string;   // e.g., "Merch", "Card", "Sticker"
};

export type CartLine = { id: string; qty: number }; // id -> Item.id

