import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { getProduct } from '../../lib/products';
import { useCart } from '../../context/CartContext';

export default function WishlistPage() {
  const { ids, remove } = useWishlist();
  const { add } = useCart();

  const products = ids.map(id => getProduct(id)).filter(Boolean);

  const addToCart = (id: string) => {
    const p = getProduct(id);
    if (!p) return;
    add({ id: p.id, name: p.name, priceNatur: p.baseNatur, qty: 1 });
  };

  if (products.length === 0) {
    return (
      <div className="p-8">
        <h1>Wishlist</h1>
        <p>Nothing saved yet—browse the catalog.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1>Wishlist</h1>
      <div className="flex flex-col gap-4 mt-4">
        {products.map(p => (
          <div key={p!.id} className="flex items-center gap-4 border rounded p-4">
            <Link to={`/marketplace/item?id=${p!.id}`} className="shrink-0">
              <img src={p!.img} alt={p!.name} className="w-20 h-20 object-contain" />
            </Link>
            <div className="flex-1">
              <Link to={`/marketplace/item?id=${p!.id}`} className="font-semibold">
                {p!.name}
              </Link>
              <div>{p!.baseNatur} NATUR</div>
            </div>
            <button onClick={() => addToCart(p!.id)} className="bg-green-600 text-white px-3 py-1 rounded">
              Add to cart
            </button>
            <button
              onClick={() => remove(p!.id)}
              className="ml-2 text-sm text-red-500 underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

