import { useEffect, useState } from 'react';

import { countWishlist } from '@/features/wishlist/api';

export default function HeaderHeart() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      try {
        const value = await countWishlist();
        if (active) setCount(value);
      } catch {
        if (active) setCount(0);
      }
    };

    refresh();

    const update = () => {
      void refresh();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('wishlist:changed', update);
    }

    return () => {
      active = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('wishlist:changed', update);
      }
    };
  }, []);

  return (
    <a className="hdr-heart" href="/marketplace/wishlist" aria-label="Wishlist">
      <span aria-hidden="true">❤️</span>
      {count > 0 && <span className="badge">{count}</span>}
    </a>
  );
}
