import React from 'react';
import { useNavigate } from 'react-router-dom';
import CartLine from '../../components/CartLine';
import { fmtNatur } from '../../lib/money';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, inc, dec, remove, clear, totalNatur } = useCart();

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
        <button onClick={() => navigate('/marketplace/review')}>Review & details</button>
        <button onClick={clear}>Clear cart</button>
      </div>
    </section>
  );
}
