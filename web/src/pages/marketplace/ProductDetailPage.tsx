import { useState } from 'react';
import { getNavatar } from '../../lib/navatar';

export default function ProductDetailPage({ product }: { product: any }) {
  const navatar = getNavatar();
  const [showNavatar, setShowNavatar] = useState(false);

  return (
    <div className="page">
      <h1>{product.name}</h1>
      <div style={{ position: 'relative', width: 300 }}>
        <img src={product.image} alt={product.name} style={{ width: '100%' }} />
        {navatar && showNavatar && (
          <img
            src={navatar.image}
            alt="navatar"
            style={{ position: 'absolute', bottom: 0, right: 0, width: '40%', borderRadius: '50%' }}
          />
        )}
      </div>
      <p>{product.description}</p>
      <label>
        <input
          type="checkbox"
          checked={showNavatar}
          onChange={(e) => setShowNavatar(e.target.checked)}
        />
        Preview with my Navatar
      </label>
    </div>
  );
}
