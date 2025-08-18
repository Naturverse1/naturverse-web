import React, { useEffect, useState } from 'react';
import { getNavatar } from '../lib/navatar';
import { isFav, toggleFav, subscribe, unsubscribe } from '../lib/wishlist';

export default function ProductCard({ product }: { product: any }) {
  const navatar = getNavatar();
  const [fav, setFav] = useState(isFav(product.id));

  useEffect(() => {
    const cb = (ids: string[]) => setFav(ids.includes(product.id));
    subscribe(cb);
    return () => unsubscribe(cb);
  }, [product.id]);

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFav(product.id);
    setFav(next);
  };

  return (
    <div className="product-card">
      <div className="thumb" style={{ position: 'relative' }}>
        <img src={product.image} alt={product.name} />
        <button
          className="heart-btn icon-btn"
          aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={fav}
          onClick={onToggle}
        >
          {fav ? '♥' : '♡'}
        </button>
        {navatar && (
          <img
            src={navatar}
            alt="navatar"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '35%',
              borderRadius: '50%',
              border: '2px solid #fff',
            }}
          />
        )}
      </div>
      <h3>{product.name}</h3>
      <p>{product.price} NATUR</p>
    </div>
  );
}

