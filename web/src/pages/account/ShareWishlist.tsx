import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { importWishlist } from '../../lib/wishlist';
import { getProduct } from '../../lib/products';
import { useToast } from '../../components/ui/useToast';

export default function ShareWishlist() {
  const [sp] = useSearchParams();
  const data = sp.get('data') || '';
  const toast = useToast();

  const ids = useMemo(() => importWishlist(data), [data]);

  useEffect(() => {
    console.log('wishlist_share_opened');
    if (!ids.length) {
      toast.error('Invalid share link');
    }
  }, [ids, toast]);

  const items = ids
    .map(id => getProduct(id))
    .filter(Boolean);

  if (!items.length) {
    return (
      <div className="page">
        <h1>Shared Wishlist</h1>
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Shared Wishlist</h1>
      <div className="wishlist-grid">
        {items.map(p => (
          <a key={p!.id} href={`/marketplace/item?id=${p!.id}`}> 
            <img src={(p as any).img} alt={p!.name} />
            <div>{p!.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
