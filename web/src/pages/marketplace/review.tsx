import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartLine from '../../components/CartLine';
import { fmtNatur, natur } from '../../lib/money';
import { useCart } from '../../context/CartContext';

type Buyer = { name: string; email: string };

function loadBuyer(): Buyer {
  try {
    const raw = localStorage.getItem('buyer_info');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { name: '', email: '' };
}

export default function ReviewPage() {
  const nav = useNavigate();
  const { items, inc, dec, remove, totalNatur } = useCart();
  const [buyer, setBuyer] = useState<Buyer>(loadBuyer());
  const [touched, setTouched] = useState(false);

  const valid = useMemo(() => {
    const hasItems = items.length > 0;
    const okName = buyer.name.trim().length >= 2;
    const okEmail = /\S+@\S+\.\S+/.test(buyer.email);
    return hasItems && okName && okEmail;
  }, [items, buyer]);

  useEffect(() => {
    try { localStorage.setItem('buyer_info', JSON.stringify(buyer)); } catch {}
  }, [buyer]);

  const fees = natur(totalNatur * 0.00); // fee placeholder (0% for now)
  const grand = natur(totalNatur + fees);

  return (
    <section>
      <a href="/marketplace">← Back to Marketplace</a>
      <h1>Review & details</h1>

      {items.length === 0 ? (
        <p>Your cart is empty. <a href="/marketplace">Browse products</a></p>
      ) : (
        <>
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

          <div style={{margin:'1rem 0', display:'grid', gap:'.25rem', justifyContent:'start'}}>
            <div><strong>Items:</strong> {fmtNatur(totalNatur)}</div>
            <div><strong>Fees:</strong> {fmtNatur(fees)}</div>
            <div><strong>Total:</strong> {fmtNatur(grand)}</div>
          </div>

          <div style={{marginTop:'1rem'}}>
            <h2>Buyer</h2>
            <div style={{display:'grid', gap:'.5rem', maxWidth:420}}>
              <input
                placeholder="Full name"
                value={buyer.name}
                onChange={e => setBuyer({ ...buyer, name: e.target.value })}
                onBlur={() => setTouched(true)}
              />
              <input
                placeholder="Email (for receipt)"
                value={buyer.email}
                onChange={e => setBuyer({ ...buyer, email: e.target.value })}
                onBlur={() => setTouched(true)}
              />
              {!valid && touched && (
                <small style={{color:'#fca5a5'}}>Please enter a name and valid email.</small>
              )}
            </div>
          </div>

          <div style={{marginTop:'1rem', display:'flex', gap:'.75rem'}}>
            <button onClick={() => nav('/marketplace/cart')}>Edit cart</button>
            <button
              disabled={!valid}
              onClick={() => nav('/marketplace/checkout')}
              title={!valid ? 'Complete buyer details first' : 'Continue'}
            >
              Continue to NATUR payment
            </button>
          </div>
        </>
      )}
    </section>
  );
}
