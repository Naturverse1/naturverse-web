export type LinkItem = {
  id: string;
  kind: 'world' | 'zone' | 'market';
  title: string;
  subtitle?: string;
  href: string;
  tags?: string[];
};

export const WORLDS: LinkItem[] = [
  { id: 'thailandia', kind: 'world', title: 'Thailandia', subtitle: 'Kingdom of Smiles', href: '/worlds/thailandia', tags: ['asia'] },
  { id: 'aurora', kind: 'world', title: 'Aurora Isles', href: '/worlds/aurora', tags: ['islands'] },
  // add others as desired…
];

export const ZONES: LinkItem[] = [
  { id: 'bangkok', kind: 'zone', title: 'Bangkok', subtitle: 'City Zone', href: '/zones/bangkok', tags: ['thailandia','city'] },
  { id: 'chiangmai', kind: 'zone', title: 'Chiang Mai', href: '/zones/chiang-mai', tags: ['thailandia','mountain'] },
  { id: 'phuket', kind: 'zone', title: 'Phuket', href: '/zones/phuket', tags: ['thailandia','island'] },
];

export const MARKET: LinkItem[] = [
  { id: 'stickers', kind: 'market', title: 'Sticker Packs', href: '/marketplace/stickers', tags: ['store'] },
  { id: 'avatars', kind: 'market', title: 'Avatar Gear', href: '/marketplace/avatars', tags: ['store'] },
];

export const CATALOG: LinkItem[] = [...WORLDS, ...ZONES, ...MARKET];
