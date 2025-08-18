import { PRODUCTS } from './products'

export const seedProducts = [
  { id: 'demo-1', name: 'Natur Tee', price: 2500, tags: ['apparel'] },
  { id: 'demo-2', name: 'Natur Bottle', price: 1900, tags: ['gear'] }
]

export type SearchResultItem = {
  id: string
  kind: 'page' | 'product' | 'account'
  title: string
  subtitle?: string
  path: string
  keywords?: string[]
}
const BASE_ITEMS: SearchResultItem[] = [
  { id: 'home', kind: 'page', title: 'Home', path: '/' },
  { id: 'worlds', kind: 'page', title: 'Worlds', path: '/worlds' },
  { id: 'arcade', kind: 'page', title: 'Arcade', path: '/zones/arcade' },
  { id: 'market', kind: 'page', title: 'Marketplace', path: '/marketplace' },
  { id: 'orders', kind: 'account', title: 'Orders', path: '/account/orders' }
]

let productCache: SearchResultItem[] | null = null

function getProductItems(): SearchResultItem[] {
  if (productCache) return productCache;
  productCache = PRODUCTS.map(p => ({
    id: `prod-${p.id}`,
    kind: 'product' as const,
    title: p.name,
    subtitle: p.category,
    path: `/marketplace/item?id=${p.id}`,
    keywords: [p.category.toLowerCase()],
  }));
  return productCache;
}

export function getBaseItems(): SearchResultItem[] {
  return BASE_ITEMS
}

export function score(q: string, it: SearchResultItem): number {
  q = q.toLowerCase().trim();
  if (!q) return 0;
  const hay = [it.title, it.subtitle, it.path, ...(it.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (hay.includes(q)) return Math.min(100, 40 + q.length * 3);
  if (hay.startsWith(q)) return 80;
  return 0;
}

export function search(q: string): SearchResultItem[] {
  const items = [...getBaseItems(), ...getProductItems()];
  return items
    .map(it => ({ it, s: score(q, it) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 20)
    .map(x => x.it);
}

const RECENT_KEY = 'nv_recent_cmd_v1';

export function remember(path: string) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    const next = [path, ...arr.filter(p => p !== path)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

export function getRecent(): SearchResultItem[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    const map = new Map([...getBaseItems(), ...getProductItems()].map(i => [i.path, i]))
    return arr.map(p => map.get(p)).filter(Boolean) as SearchResultItem[]
  } catch {
    return [];
  }
}

export { seedProducts };

