export type SearchItem = {
  id: string;
  kind: 'page' | 'product' | 'account';
  title: string;
  subtitle?: string;
  path: string;
  keywords?: string[];
};

import { PRODUCTS } from './products';

const BASE_ITEMS: SearchItem[] = [
  { id: 'home', kind: 'page', title: 'Home', path: '/' },
  { id: 'worlds', kind: 'page', title: 'Worlds', path: '/worlds' },
  { id: 'zones', kind: 'page', title: 'Zones', path: '/zones' },
  { id: 'arcade', kind: 'page', title: 'Arcade', path: '/zones/arcade' },
  { id: 'marketplace', kind: 'page', title: 'Marketplace', path: '/marketplace' },
  { id: 'checkout', kind: 'page', title: 'Checkout', path: '/marketplace/checkout' },
  { id: 'support', kind: 'page', title: 'Support', path: '/support' },
  { id: 'about', kind: 'page', title: 'About', path: '/about' },
  { id: 'faq', kind: 'page', title: 'FAQ', path: '/faq' },
  { id: 'privacy', kind: 'page', title: 'Privacy', path: '/privacy' },
  { id: 'terms', kind: 'page', title: 'Terms', path: '/terms' },
  { id: 'profile', kind: 'account', title: 'Profile', path: '/profile' },
  { id: 'orders', kind: 'account', title: 'Orders', path: '/account/orders' },
  { id: 'addresses', kind: 'account', title: 'Addresses', path: '/account/addresses' },
  { id: 'wishlist', kind: 'account', title: 'Wishlist', path: '/account/wishlist' },
  { id: 'settings', kind: 'account', title: 'Settings', path: '/settings' },
];

export function getBaseItems(): SearchItem[] {
  return BASE_ITEMS;
}

export function getProductItems(): SearchItem[] {
  return PRODUCTS.map(p => ({
    id: `product-${p.id}`,
    kind: 'product' as const,
    title: p.name,
    subtitle: p.category,
    path: `/marketplace/item?id=${p.id}`,
    keywords: [p.category.toLowerCase()],
  }));
}

function norm(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export function score(query: string, item: SearchItem): number {
  const q = norm(query.trim());
  if (!q) return 0;
  const t = norm(item.title);
  const sub = norm(item.subtitle || '');
  const keys = (item.keywords || []).map(norm);
  let s = 0;
  if (t.startsWith(q)) s += 50;
  else if (t.includes(q)) s += 40;
  if (sub.startsWith(q)) s += 20;
  else if (sub.includes(q)) s += 10;
  if (keys.some(k => k.startsWith(q))) s += 15;
  else if (keys.some(k => k.includes(q))) s += 5;
  return Math.min(100, s);
}

export function search(query: string): SearchItem[] {
  const all = [...getBaseItems(), ...getProductItems()];
  return all
    .map(i => ({ item: i, s: score(query, i) }))
    .filter(r => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 20)
    .map(r => r.item);
}

const RECENT_KEY = 'nv_recent_cmd_v1';
const RECENT_LIMIT = 8;

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeRecent(paths: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(paths.slice(0, RECENT_LIMIT)));
  } catch {}
}

export function remember(path: string) {
  const cur = readRecent().filter(p => p !== path);
  cur.unshift(path);
  writeRecent(cur);
}

export function getRecent(): SearchItem[] {
  const paths = readRecent();
  const all = [...getBaseItems(), ...getProductItems()];
  return paths
    .map(p => all.find(i => i.path === p))
    .filter(Boolean) as SearchItem[];
}

// utility to ensure product items loaded (no-op for static data)
export function seedProducts() {
  getProductItems();
}

