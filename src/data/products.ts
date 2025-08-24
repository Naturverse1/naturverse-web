export type Product = { id: string; name: string; price: number; img?: string };
export const PRODUCTS: Product[] = [
  { id: "plush-turian", name: "Turian Plush", price: 24.0, img: "/assets/market/plush-turian.png" },
  { id: "tee-navatar",  name: "Navatar Tee",  price: 18.0, img: "/assets/market/tee-navatar.png"  },
  { id: "sticker-pack", name: "Sticker Pack", price: 6.0,  img: "/assets/market/stickers.png"     },
];
