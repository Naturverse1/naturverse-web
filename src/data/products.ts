export type Product = {
  slug: string;
  name: string;
  price: number;
  img: string;
  desc?: string;
};

export const PRODUCTS: Product[] = [
  { slug: "turian-plush",  name: "Turian Plush",  price: 24, img: "/Marketplace/Turianplushie.png", desc: "Cuddly plush of Turian." },
  { slug: "navatar-tee",   name: "Navatar Tee",   price: 18, img: "/Marketplace/Turiantshirt.png",  desc: "Graphic tee with Navatar scooter art." },
  { slug: "sticker-pack",  name: "Sticker Pack",  price: 6,  img: "/Marketplace/Stickerpack.png",   desc: "Assorted Naturverse stickers." },
];

export const bySlug = (slug: string) => PRODUCTS.find(p => p.slug === slug);
