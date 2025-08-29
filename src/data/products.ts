export type Product = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  image?: string;
  price: number; // display only
  category: "Digital" | "Physical" | "Experience";
  tags?: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "p-breath-starter",
    name: "Breathwork Starter Pack",
    slug: "breathwork-starter",
    summary: "Guided 7-day breathwork for calm & focus.",
    image: "/images/products/breath-starter.jpg",
    price: 9,
    category: "Digital",
    tags: ["breath", "calm", "focus"]
  },
  {
    id: "p-navatar-kit",
    name: "Navatar Style Kit",
    slug: "navatar-style-kit",
    summary: "Hats, frames, and effects to customize your Navatar.",
    image: "/images/products/navatar-kit.jpg",
    price: 9.99,
    category: "Digital",
    tags: ["avatar", "style"]
  },
  {
    id: "p-seed-journal",
    name: "Seed Journal",
    slug: "seed-journal",
    summary: "Dot-grid journal to plant ideas and track habits.",
    image: "/images/products/seed-journal.jpg",
    price: 18,
    category: "Physical",
    tags: ["journaling", "growth"]
  },
  {
    id: "p-tide-session",
    name: "Tides Session",
    slug: "tides-session",
    summary: "1-hour movement & rhythm coaching (video).",
    image: "/images/products/tide-session.jpg",
    price: 39,
    category: "Experience",
    tags: ["movement", "rhythm"]
  }
];
