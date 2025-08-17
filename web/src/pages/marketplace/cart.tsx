import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartLine from '../../components/CartLine';
import { fmtNatur } from '../../lib/money';
import { useCart } from '../../context/CartContext';
import {
  encodeCartToQuery,
  decodeCartFromQuery,
} from '../../lib/cartPersist';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, inc, dec, remove, clear, add, totalNatur } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('cart');
    if (q) {
      const lines = decodeCartFromQuery(q);
      if (lines && window.confirm('Load shared cart? Replace your current cart?')) {
        clear();
        lines.forEach((l: any) => add(l));
      }
      params.delete('cart');
      const url = `${location.pathname}${params.toString() ? '?' + params : ''}`;
      history.replaceState(null, '', url);
    }
  }, []);

  if (!items.length) {
    return (
      <section>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <a href="/marketplace">Browse products</a>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>
      <div style={{display:'grid', gap:'.75rem', margin:'1rem 0'}}>
        {items.map(line => (
          <CartLine
            key={line.id}
            line={line}
            onInc={() => inc(line.id)}
            onDec={() => dec(line.id)}
            onRemove={() => remove(line.id)}
          />
        ))}
      </div>

      <p style={{marginTop:'1rem'}}><strong>Total:</strong> {fmtNatur(totalNatur)}</p>

        <div style={{marginTop:'1rem', display:'flex', gap:'.75rem'}}>
          <button onClick={() => navigate('/marketplace/checkout')}>Checkout</button>
          <button onClick={clear}>Clear cart</button>
          <button
            onClick={() => {
              const url = `${location.origin}${location.pathname}?cart=${encodeCartToQuery(items)}`;
              navigator.clipboard.writeText(url);
              console.log('cart_shared_link_copied');
            }}
          >
            Share cart
          </button>
        </div>
    </section>
  );
}
