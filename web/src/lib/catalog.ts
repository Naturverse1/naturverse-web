import type { SortKey, Filters } from '../components/marketplace/FilterBar';

export type Item = {
  id: string;
  name: string;
  price: number;
  category: string;
  createdAt: number;
  img: string;
};

export function applyFilters(items: Item[], f: Filters) {
  let out = items.slice();
  if (f.q) {
    const q = f.q.toLowerCase();
    out = out.filter(i => (i.name || '').toLowerCase().includes(q));
  }
  if (f.cats?.length) out = out.filter(i => f.cats.includes(i.category));
  if (f.min != null) out = out.filter(i => i.price >= f.min!);
  if (f.max != null) out = out.filter(i => i.price <= f.max!);
  switch (f.sort) {
    case 'price_asc':
      out.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      out.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      out.sort((a, b) => b.createdAt - a.createdAt);
      break;
    default:
      break;
  }
  return out;
}

export const DEFAULT_FILTERS: Filters = { q: '', cats: [], sort: 'relevance' };

