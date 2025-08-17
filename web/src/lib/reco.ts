export type Item = { id:string; name:string; price:number; category:string; image:string; createdAt:number };
const KEY = "natur_recent_v1";
const LIMIT = 20;

export function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveRecent(ids: string[]) { localStorage.setItem(KEY, JSON.stringify(ids.slice(0, LIMIT))); }

export function pushRecent(id: string) {
  const cur = loadRecent().filter(x => x !== id);
  cur.unshift(id);
  saveRecent(cur);
  // broadcast
  try { window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: JSON.stringify(cur) })); } catch {}
  console.log('recent_push', { id });
}

export function recentItems(all: Item[]): Item[] {
  const map = new Map(all.map(i => [i.id, i]));
  return loadRecent().map(id => map.get(id)).filter(Boolean) as Item[];
}

/** Recommend by same category and price closeness (±30%), fallback to newest in category. */
export function recommendFor(item: Item, all: Item[], take=8): Item[] {
  const pool = all.filter(p => p.id !== item.id && p.category === item.category);
  const close = pool
    .map(p => ({ p, diff: Math.abs(p.price - item.price) / Math.max(1, item.price) }))
    .sort((a,b)=> a.diff - b.diff);
  let out = close.filter(x => x.diff <= 0.3).map(x => x.p);
  if (out.length < take) {
    const remainder = pool
      .filter(p => !out.includes(p))
      .sort((a,b)=> b.createdAt - a.createdAt);
    out = out.concat(remainder);
  }
  return out.slice(0, take);
}

/** Recommend from a set of categories (for cart/success). */
export function recommendForCats(cats: string[], all: Item[], take=6): Item[] {
  const set = new Set(cats);
  const pool = all.filter(p => set.has(p.category));
  const newest = pool.sort((a,b)=> b.createdAt - a.createdAt);
  return newest.slice(0, take);
}
