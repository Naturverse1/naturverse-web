const KEY = 'natur_wishlist_v1';

type Listener = (ids: string[]) => void;

const listeners = new Set<Listener>();

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {}
  listeners.forEach(cb => cb(ids));
  window.dispatchEvent(new CustomEvent('wishlist:update', { detail: ids }));
}

export function getWishlist(): string[] {
  return read();
}

export function isFav(id: string): boolean {
  return read().includes(id);
}

export function toggleFav(id: string): boolean {
  const ids = read();
  let next: string[];
  let fav: boolean;
  if (ids.includes(id)) {
    next = ids.filter(x => x !== id);
    fav = false;
    console.log('wishlist_remove', { id });
  } else {
    next = [...ids, id];
    fav = true;
    console.log('wishlist_add', { id });
  }
  write(next);
  return fav;
}

export function subscribe(cb: Listener) {
  listeners.add(cb);
}

export function unsubscribe(cb: Listener) {
  listeners.delete(cb);
}

// cross-tab sync
window.addEventListener('storage', e => {
  if (e.key === KEY) {
    listeners.forEach(cb => cb(read()));
  }
});

// manual event to allow other scripts to trigger updates
window.addEventListener('wishlist:update', () => {
  listeners.forEach(cb => cb(read()));
});

