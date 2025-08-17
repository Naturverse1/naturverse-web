export type CartLine = {
  id: string;
  name: string;
  image?: string;
  priceNatur: number;
  qty: number;
  variant?: { size?: string; material?: string };
};

const KEY = 'natur_cart_v2';

export function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {}
}

export function encodeCartToQuery(lines: CartLine[]): string {
  const minimal = lines.map(l => ({
    id: l.id,
    name: l.name,
    image: l.image,
    priceNatur: l.priceNatur,
    qty: l.qty,
    variant: l.variant,
  }));
  return btoa(JSON.stringify(minimal));
}

export function decodeCartFromQuery(q: string): CartLine[] | null {
  try {
    return JSON.parse(atob(q));
  } catch {
    return null;
  }
}

export function onStorageSync(cb: (lines: CartLine[]) => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === KEY) {
      cb(loadCart());
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
