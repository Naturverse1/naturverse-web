import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CartLine from '../../../components/CartLine';
import { fmtNatur, natur } from '../../../lib/money';
import { useCart } from '../../../context/CartContext';
import type { Shipping } from '../../../lib/orders';

function loadShipping(): Shipping | null {
  try {
    const raw = localStorage.getItem('natur_shipping');
    if (raw) return JSON.parse(raw) as Shipping;
  } catch {}
  return null;
}

export default function ReviewPage() {
  const nav = useNavigate();
  const { items, inc, dec, remove, totalNatur } = useCart();
  const shipping = loadShipping();

  const fees = natur(totalNatur * 0.0);
  const grand = natur(totalNatur + fees);

  const hasItems = items.length > 0;

  return (
    <section>
      <a href="/marketplace/checkout/shipping">← Back to Shipping</a>
      <h1>Review</h1>

      {!hasItems && <p>Your cart is empty.</p>}

      {hasItems && (
        <>
          <div style={{ display: 'grid', gap: '.75rem', margin: '1rem 0' }}>
            {items.map((line) => (
              <CartLine
                key={line.id}
                line={line}
                onInc={() => inc(line.id)}
                onDec={() => dec(line.id)}
                onRemove={() => remove(line.id)}
              />
            ))}
          </div>

          <div style={{ margin: '1rem 0', display: 'grid', gap: '.25rem', justifyContent: 'start' }}>
            <div>
              <strong>Items:</strong> {fmtNatur(totalNatur)}
            </div>
            <div>
              <strong>Fees:</strong> {fmtNatur(fees)}
            </div>
            <div>
              <strong>Total:</strong> {fmtNatur(grand)}
            </div>
          </div>

          {shipping && (
            <div style={{ marginTop: '1rem' }}>
              <h2>Shipping</h2>
              <p style={{ whiteSpace: 'pre-line' }}>
                {shipping.fullName}
                {'\n'}
                {shipping.address1}
                {shipping.address2 ? `\n${shipping.address2}` : ''}
                {'\n'}
                {shipping.city}, {shipping.state} {shipping.postal}
                {'\n'}
                {shipping.country}
                {'\n'}
                {shipping.email}
                {shipping.phone ? `\n${shipping.phone}` : ''}
              </p>
              <a href="/marketplace/checkout/shipping">Edit</a>
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem' }}>
            <button onClick={() => nav('/marketplace/cart')}>Edit cart</button>
            <button onClick={() => nav('/marketplace/checkout/pay')}>
              Continue to NATUR payment
            </button>
          </div>
        </>
      )}
    </section>
  );
}

