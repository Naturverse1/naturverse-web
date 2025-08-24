import { Product } from "./types";

export const products: Product[] = [
  {
    slug: "turian-plush",
    name: "Turian Plush",
    price: 24,
    image: "/Marketplace/Turianplushie.png",
    description: "Cuddly plush of Turian.",
  },
  {
    slug: "navatar-tee",
    name: "Navatar Tee",
    price: 18,
    image: "/Marketplace/Turiantshirt.png",
    description: "Soft cotton tee.",
  },
  {
    slug: "sticker-pack",
    name: "Sticker Pack",
    price: 6,
    image: "/Marketplace/Stickerpack.png",
    description: "6 glossy stickers.",
  },
];

export const bySlug = (s: string) => products.find((p) => p.slug === s)!;
