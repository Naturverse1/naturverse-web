export type Product = {
  id: string;
  name: string;
  baseNatur: number; // price per unit in NATUR
  img: string; // base product image (used as preview background)
  options: {
    sizes: { key: string; label: string; multiplier: number }[];
    materials?: { key: string; label: string; multiplier: number }[];
  };
};

export const PRODUCTS: Product[] = [
  {
    id: 'plush-classic',
    name: 'Turian Plush',
    baseNatur: 50,
    img: '/assets/market/plush.png',
    options: {
      sizes: [
        { key: 's', label: 'Small (8\")', multiplier: 1 },
        { key: 'm', label: 'Medium (12\")', multiplier: 1.5 },
        { key: 'l', label: 'Large (16\")', multiplier: 2 },
      ],
      materials: [
        { key: 'std', label: 'Standard', multiplier: 1 },
        { key: 'xl', label: 'Extra-soft', multiplier: 1.2 },
      ],
    },
  },
  {
    id: 'tee-kids',
    name: 'Kids Tee',
    baseNatur: 25,
    img: '/assets/market/tee.png',
    options: {
      sizes: [
        { key: 's', label: 'S', multiplier: 1 },
        { key: 'm', label: 'M', multiplier: 1.05 },
        { key: 'l', label: 'L', multiplier: 1.1 },
      ],
    },
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find(p => p.id === id);
}

