import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import { getWishlist } from '@/utils/wishlist';

export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>(() => getWishlist());

  useEffect(() => {
    const onStorage = () => setIds(getWishlist());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const items = PRODUCTS.filter(p => ids.includes(p.id));

  return (
    <main className="marketplace container" style={{ padding: 24 }}>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/marketplace">Marketplace</Link></li>
          <li aria-current="page">Wishlist</li>
        </ol>
      </nav>
      {items.length > 0 ? (
        <ul>
          {items.map(p => (
            <li key={p.id}>
              <Link to={`/marketplace/${p.id}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </main>
  );
}

