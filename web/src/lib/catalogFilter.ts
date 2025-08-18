export type Sort = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

export interface FilterState {
  q: string;
  cats: string[];
  min: number;
  max: number;
  sort: Sort;
  page: number;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  category: string;
  price: number;
  createdAt: number;
  popularity?: number;
  [key: string]: any;
}

function scoreItem(item: Item, q: string): number {
  if (!q) return 0;
  const term = q.toLowerCase();
  let score = 0;
  if (item.name.toLowerCase().includes(term)) score += 2;
  if (item.description && item.description.toLowerCase().includes(term)) score += 1;
  if (item.tags && item.tags.some(t => t.toLowerCase().includes(term))) score += 1;
  return score;
}

export function applyFilters(items: Item[], { q, cats, min, max, sort }: FilterState) {
  const withScore = items
    .map(item => ({ item, score: scoreItem(item, q) }))
    .filter(entry => (q ? entry.score > 0 : true))
    .filter(entry => (cats.length ? cats.includes(entry.item.category) : true))
    .filter(entry => entry.item.price >= min && entry.item.price <= max);

  const sorted = withScore.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return a.item.price - b.item.price;
      case 'price_desc':
        return b.item.price - a.item.price;
      case 'newest':
        return b.item.createdAt - a.item.createdAt;
      default: {
        if (b.score !== a.score) return b.score - a.score;
        const popA = a.item.popularity ?? 0;
        const popB = b.item.popularity ?? 0;
        if (popB !== popA) return popB - popA;
        return b.item.createdAt - a.item.createdAt;
      }
    }
  });

  return sorted.map(s => s.item);
}

export function slicePage(items: Item[], page: number, size: number) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * size;
  const pageItems = items.slice(start, start + size);
  return { pageItems, total, pages };
}

export function parseQuery(search: string): FilterState {
  const sp = new URLSearchParams(search); // search may start with '?'
  const q = sp.get('q') || '';
  const cats = sp.get('cats') ? sp.get('cats')!.split(',').filter(Boolean) : [];
  const min = parseFloat(sp.get('min') || '0');
  const maxRaw = sp.get('max');
  const max = maxRaw === null ? Infinity : parseFloat(maxRaw);
  const sort = (sp.get('sort') as Sort) || 'relevance';
  const page = parseInt(sp.get('page') || '1', 10);
  return {
    q,
    cats,
    min: isNaN(min) || min < 0 ? 0 : min,
    max: isNaN(max) || max < 0 ? Infinity : max,
    sort,
    page: isNaN(page) || page < 1 ? 1 : page,
  };
}

export function stringifyQuery(state: FilterState): string {
  const sp = new URLSearchParams();
  if (state.q) sp.set('q', state.q);
  if (state.cats.length) sp.set('cats', state.cats.join(','));
  if (state.min > 0) sp.set('min', String(state.min));
  if (state.max !== Infinity) sp.set('max', String(state.max));
  if (state.sort !== 'relevance') sp.set('sort', state.sort);
  if (state.page > 1) sp.set('page', String(state.page));
  const s = sp.toString();
  return s ? `?${s}` : '';
}
