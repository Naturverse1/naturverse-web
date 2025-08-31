export type Rarity = 'starter' | 'rare' | 'legendary';

export type Navatar = {
  id: string;
  slug: string;
  name: string;
  rarity: Rarity;
  priceCents: number; // 0 for free (dev)
  priceNatur?: number;   // optional $NATUR cost
  img: string; // public path
  tags?: string[];
};

export const NAVATARS: Navatar[] = [
  {
    id: 'seedling-01',
    slug: 'seedling',
    name: 'Seedling',
    rarity: 'starter',
    priceCents: 0,
    priceNatur: 0,
    img: '/navatars/seedling.svg',
    tags: ['green', 'calm'],
  },
  {
    id: 'splash-01',
    slug: 'songkran-splash',
    name: 'Songkran Splash',
    rarity: 'rare',
    priceCents: 300,
    priceNatur: 100,
    img: '/navatars/splash.svg',
    tags: ['thailandia', 'festival'],
  },
  {
    id: 'zenpanda-01',
    slug: 'zen-panda',
    name: 'Zen Panda',
    rarity: 'legendary',
    priceCents: 1200,
    priceNatur: 400,
    img: '/navatars/zenpanda.svg',
    tags: ['focus', 'balance'],
  },
  {
    id: 'fire-fox-01',
    slug: 'fire-fox',
    name: 'Fire Fox',
    rarity: 'rare',
    priceCents: 500,
    priceNatur: 150,
    img: '/navatars/firefox.svg',
    tags: ['energy'],
  },
  {
    id: 'ocean-orb-01',
    slug: 'ocean-orb',
    name: 'Ocean Orb',
    rarity: 'starter',
    priceCents: 0,
    priceNatur: 0,
    img: '/navatars/oceanorb.svg',
    tags: ['water'],
  },
  {
    id: 'bamboo-01',
    slug: 'bamboo-buddy',
    name: 'Bamboo Buddy',
    rarity: 'starter',
    priceCents: 0,
    priceNatur: 0,
    img: '/navatars/bamboo.svg',
    tags: ['earth'],
  },
];
