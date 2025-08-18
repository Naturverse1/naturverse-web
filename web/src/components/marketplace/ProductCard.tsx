import React from 'react';
import { getNavatar } from '../../lib/navatar';
import type { Item } from '../../lib/catalog';
import WishlistButton from '../WishlistButton';

export default function ProductCard({ item }: { item: Item }) {
  const navatar = getNavatar();
  return (
    <div className="product-card">
      <div className="thumb" style={{ position: 'relative' }}>
        <img src={item.img} alt={item.name} />
        <WishlistButton id={item.id} />
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
      <h3>{item.name}</h3>
      <p>{item.price} NATUR</p>
    </div>
  );
}
