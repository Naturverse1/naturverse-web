const KEY = "nv_wishlist";

export type WishItem = { id: string; addedAt: number };

function read(): WishItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WishItem[]) : [];
  } catch {
    return [];
  }
}
function write(items: WishItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function getWishlist(): string[] {
  return read().map(x => x.id);
}
export function isWished(id: string): boolean {
  return getWishlist().includes(id);
}
export function toggleWish(id: string): boolean {
  const items = read();
  const i = items.findIndex(x => x.id === id);
  if (i >= 0) {
    items.splice(i, 1);
    write(items);
    return false;
  } else {
    items.push({ id, addedAt: Date.now() });
    write(items);
    return true;
  }
}
export function clearWishlist() {
  write([]);
}
