import React from 'react';
import { getNavatar } from '../lib/navatar';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product }: { product: any }) {
  const navatar = getNavatar();

  return (
    <div className="product-card">
      <div className="thumb" style={{ position: 'relative' }}>
        <img src={product.image} alt={product.name} />
        <WishlistButton id={product.id} />
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
