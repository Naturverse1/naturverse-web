import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/marketplace/ProductCard';
import { getWishlist, subscribe, unsubscribe } from '../../lib/wishlist';
import { getProduct } from '../../lib/products';
import { Item as CatItem } from '../../lib/catalog';
import { useCart } from '../../context/CartContext';

export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>(getWishlist());
  const { add, openMiniCart } = useCart();

  useEffect(() => {
    const cb = (next: string[]) => setIds(next);
    subscribe(cb);
    return () => unsubscribe(cb);
  }, []);

  const items: CatItem[] = ids
    .map(id => {
      const p = getProduct(id);
      return p
        ? {
            id: p.id,
            name: p.name,
            price: p.baseNatur,
            category: p.category,
            createdAt: p.createdAt,
            img: p.img,
          }
        : null;
    })
    .filter(Boolean) as CatItem[];

  const handleAdd = (item: CatItem) => {
    add({
      id: `${item.id}::XS::Cotton`,
      name: item.name,
      image: item.img,
      priceNatur: item.price,
      qty: 1,
      variant: { size: 'XS', material: 'Cotton' },
    });
    openMiniCart();
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Wishlist</h1>
        <p>No favorites yet — explore the Marketplace and tap the heart.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Wishlist</h1>
      <div className="wishlist-grid">
        {items.map(item => (
          <div key={item.id} style={{ position: 'relative' }}>
            <ProductCard item={item} />
            <div style={{ marginTop: '.5rem', display: 'flex', gap: '.5rem' }}>
              <a href={`/marketplace/item?id=${item.id}`}>View</a>
              <button onClick={() => handleAdd(item)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

