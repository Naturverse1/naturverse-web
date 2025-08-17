import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartLine from '../../../components/CartLine';
import { useCart } from '../../../context/CartContext';
import {
  SHIPPING_PRICES,
  ShippingMethodId,
  calcDiscountNATUR,
  formatNatur,
} from '../../../lib/pricing';
import { getJSON, setJSON } from '../../../lib/storage';
import type { Shipping } from '../../../lib/orders';

function loadShipping(): Shipping | null {
  try {
    const raw = localStorage.getItem('natur_shipping');
    if (raw) return JSON.parse(raw) as Shipping;
  } catch {}
  return null;
}

const shipLabels: Record<ShippingMethodId, string> = {
  standard: 'Standard (3–5 days)',
  expedited: 'Expedited (1–2 days)',
};

export default function ReviewPage() {
  const nav = useNavigate();
  const { items, inc, dec, remove, totalNatur } = useCart();

  const [method, setMethod] = useState<ShippingMethodId>(
    getJSON('natur_ship_method', 'standard')
  );
  const [code, setCode] = useState(getJSON('natur_promo_code', ''));
  const [codeInput, setCodeInput] = useState(code);
  const [codeError, setCodeError] = useState<string>('');

  const itemsSubtotal = totalNatur;
  const ship = SHIPPING_PRICES[method];
  const discount = calcDiscountNATUR(code, itemsSubtotal);
  const grandTotal = Math.max(0, itemsSubtotal + ship - discount);

  useEffect(() => setJSON('natur_ship_method', method), [method]);
  useEffect(() => setJSON('natur_promo_code', code), [code]);
  useEffect(() => setJSON('natur_checkout_total', grandTotal), [grandTotal]);

  const shipping = loadShipping();
  const hasItems = items.length > 0;

  const onApply = () => {
    if (calcDiscountNATUR(codeInput, itemsSubtotal) > 0) {
      setCode(codeInput.trim().toUpperCase());
      setCodeError('');
    } else {
      setCodeError('Invalid code');
    }
  };

  const onRemoveCode = () => {
    setCode('');
    setCodeInput('');
    setCodeError('');
  };

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

          <div style={{ margin: '1rem 0' }}>
            <h2>Shipping Method</h2>
            <div style={{ display: 'grid', gap: '4px', marginTop: '4px' }}>
              {(['standard', 'expedited'] as ShippingMethodId[]).map((m) => (
                <label key={m} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="ship"
                    value={m}
                    checked={method === m}
                    onChange={() => setMethod(m)}
                  />
                  <span>
                    {shipLabels[m]} — {formatNatur(SHIPPING_PRICES[m])}
                  </span>
                </label>
              ))}
            </div>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Free standard shipping!</p>
          </div>

          <div style={{ margin: '1rem 0' }}>
            <h2>Promo Code</h2>
            {code ? (
              <div className="promo-chip" style={{ marginTop: '4px' }}>
                <span>{code}</span>
                <button onClick={onRemoveCode}>Remove</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Promo code"
                  />
                  <button onClick={onApply}>Apply</button>
                </div>
                {codeError && <div className="error">{codeError}</div>}
              </>
            )}
          </div>

          <div className="totals" style={{ margin: '1rem 0' }}>
            <div className="row">
              <span>Items Subtotal</span>
              <span>{formatNatur(itemsSubtotal)}</span>
            </div>
            <div className="row">
              <span>Shipping</span>
              <span>{formatNatur(ship)}</span>
            </div>
            {discount > 0 && (
              <div className="row">
                <span>Discount</span>
                <span>-{formatNatur(discount)}</span>
              </div>
            )}
            <div className="row grand">
              <span>Total</span>
              <span>{formatNatur(grandTotal)}</span>
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
