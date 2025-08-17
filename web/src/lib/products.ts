export type Product = {
  id: string;
  slug: string;
  family: "printable" | "merch";
  name: string;
  priceNatur: number; // base
  thumb: string;
  variants?: {
    // key -> allowed values (string arrays)
    size?: string[];
    color?: string[];
    pack?: string[];
  };
};

export const PRODUCTS: Product[] = [
  {
    id: "poster-rainforest",
    slug: "poster-rainforest",
    family: "printable",
    name: "Rainforest Poster",
    priceNatur: 120,
    thumb: "/assets/market/poster-rainforest.jpg",
    variants: { size: ["A4", "A3"] }
  },
  {
    id: "sticker-pack",
    slug: "sticker-pack",
    family: "printable",
    name: "Navatar Stickers",
    priceNatur: 60,
    thumb: "/assets/market/sticker-pack.jpg",
    variants: { pack: ["10", "25", "50"] }
  },
  {
    id: "tee-classic",
    slug: "tee-classic",
    family: "merch",
    name: "Classic Tee",
    priceNatur: 350,
    thumb: "/assets/market/tee-classic.jpg",
    variants: { size: ["XS","S","M","L","XL"], color: ["Black","White","Navy"] }
  },
  {
    id: "sweatshirt-cozy",
    slug: "sweatshirt-cozy",
    family: "merch",
    name: "Cozy Sweatshirt",
    priceNatur: 540,
    thumb: "/assets/market/sweatshirt-cozy.jpg",
    variants: { size: ["XS","S","M","L","XL"], color: ["Black","White","Navy"] }
  }
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find(p => p.slug === slug) || null;
}

