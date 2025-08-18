const KEY = 'nv_wishlist_v1';
const listeners = new Set<(ids: string[]) => void>();

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {}
  listeners.forEach(cb => cb(ids));
  // notify others
  try {
    window.dispatchEvent(new CustomEvent('wishlist:update', { detail: ids }));
  } catch {}
}

export function getWishlist(): string[] {
  return read();
}

export function isWished(id: string): boolean {
  return read().includes(id);
}

export function toggleWishlist(id: string): boolean {
  const cur = read().filter(x => x !== id);
  let wished: boolean;
  if (cur.length === read().length) {
    // not previously wished
    cur.unshift(id);
    wished = true;
  } else {
    wished = false;
  }
  write(cur);
  console.log('wishlist_toggle', { id, wished });
  return wished;
}

export function removeWish(id: string) {
  write(read().filter(x => x !== id));
}

export function clearWishlist() {
  write([]);
}

export function exportWishlist(): string {
  return btoa(JSON.stringify(read()));
}

export function importWishlist(data: string): string[] {
  try {
    const ids = JSON.parse(atob(data));
    return Array.isArray(ids) ? ids.map(String) : [];
  } catch {
    return [];
  }
}

export function subscribe(cb: (ids: string[]) => void) {
  listeners.add(cb);
}

export function unsubscribe(cb: (ids: string[]) => void) {
  listeners.delete(cb);
}

// cross-tab sync
window.addEventListener('storage', e => {
  if (e.key === KEY) {
    listeners.forEach(cb => cb(read()));
  }
});

// manual trigger
window.addEventListener('wishlist:update', () => {
  listeners.forEach(cb => cb(read()));
});
