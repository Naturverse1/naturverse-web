export type Product = {
  id: string;
  name: string;
  price: number;
  imageSrc?: string;
  imageAlt?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "turian-plush",
    name: "Turian Plush",
    price: 24.0,
    imageSrc: "/Marketplace/Turianplushie.png",
    imageAlt: "Turian plush toy mockup",
  },
  {
    id: "navatar-tee",
    name: "Navatar Tee",
    price: 18.0,
    imageSrc: "/Marketplace/Turiantshirt.png",
    imageAlt: "T-shirt with Navatar graphic",
  },
  {
    id: "sticker-pack",
    name: "Sticker Pack",
    price: 6.0,
    imageSrc: "/Marketplace/Stickerpack.png",
    imageAlt: "Naturverse sticker pack",
  },
];
