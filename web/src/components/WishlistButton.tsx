import React, { useEffect, useState } from 'react';
import { isWished, toggleWishlist, subscribe, unsubscribe } from '../lib/wishlist';
import { useToast } from './ui/useToast';

export default function WishlistButton({ id }: { id: string }) {
  const [wished, setWished] = useState(isWished(id));
  const toast = useToast();

  useEffect(() => {
    const cb = (ids: string[]) => setWished(ids.includes(id));
    subscribe(cb);
    return () => unsubscribe(cb);
  }, [id]);

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleWishlist(id);
    setWished(next);
    toast.info(next ? 'Added to wishlist' : 'Removed from wishlist');
  };

  return (
    <button
      className="heart-btn icon-btn"
      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wished}
      onClick={onToggle}
    >
      {wished ? '♥' : '♡'}
    </button>
  );
}
