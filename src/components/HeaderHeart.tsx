import { useEffect, useState } from 'react';

const KEY = 'naturverse_wishlist_v1';
const LEGACY_KEY = 'nv:wishlist';

function readCount() {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const list = JSON.parse(raw) as unknown[];
      return Array.isArray(list) ? list.length : 0;
    }
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const list = JSON.parse(legacyRaw) as unknown[];
      return Array.isArray(list) ? list.length : 0;
    }
  } catch {
    return 0;
  }
  return 0;
}

export default function HeaderHeart() {
  const [count, setCount] = useState(() => readCount());

  useEffect(() => {
    const update = () => setCount(readCount());
    update();
    window.addEventListener('wishlist:changed', update);
    return () => window.removeEventListener('wishlist:changed', update);
  }, []);

  return (
    <a className="hdr-heart" href="/marketplace/wishlist" aria-label="Wishlist">
      <span aria-hidden="true">❤️</span>
      {count > 0 && <span className="badge">{count}</span>}
    </a>
  );
}
