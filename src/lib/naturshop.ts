export type ShopItem = {
  id: string;
  name: string;
  price: number; // in NATUR
  emoji: string; // lightweight art
  blurb?: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'seed-pack', name: 'Seed Pack', price: 5, emoji: '🌱', blurb: 'Start something new.' },
  { id: 'tree-token', name: 'Tree Token', price: 10, emoji: '🌳', blurb: 'Grow the grove.' },
  { id: 'river-ride', name: 'River Ride', price: 15, emoji: '🛶', blurb: 'Glide downstream.' },
  { id: 'sun-hat', name: 'Sun Hat', price: 8, emoji: '👒', blurb: 'Cool & shady.' },
];
