import { useState } from 'react';
import { useCart } from '../lib/cart';
import Breadcrumbs from '../components/Breadcrumbs';
import { useToast } from '../components/Toast';
import ShareNavatar from '../components/ShareNavatar';
import { saveDemoOrder } from '@/lib/marketplace';
import { logEvent } from '@/lib/activity';

export default function CartPage() {
  const { items, inc, dec, remove, subtotal } = useCart();
  const [shareOpen, setShareOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleCheckout = async () => {
    if (items.length === 0 || saving) return;
    setSaving(true);
    try {
      await saveDemoOrder(items.map((it) => ({ id: it.id, name: it.name, price: it.price, qty: it.qty })));
      void logEvent('order.demo_created', { subtotal, count: items.length });
      toast({ text: 'Demo order saved ✓', kind: 'ok' });
      setShareOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Checkout failed';
      toast({ text: message, kind: 'err' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main data-page="cart" className="nvrs-section cart cart-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <h1>Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="nv-card cart-card">
          {items.map((it) => (
            <div key={it.id} className="cart-line">
              <img src={it.image} alt="" />
              <div>
                <div className="title">{it.name}</div>
                <div className="meta price">${it.price.toFixed(2)}</div>
                <div className="qty-group">
                  <div className="qty">
                    <button onClick={() => dec(it.id)} aria-label="Decrease quantity">
                      −
                    </button>
                    <input type="number" value={it.qty} readOnly aria-label="Quantity" />
                    <button onClick={() => inc(it.id)} aria-label="Increase quantity">
                      +
                    </button>
                  </div>
                  <button className="btn-danger" onClick={() => remove(it.id)}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="meta price">${(it.qty * it.price).toFixed(2)}</div>
            </div>
          ))}
          <hr />
          <div className="subtotal-row subtotal">
            <strong className="label">Subtotal</strong>
            <strong className="value">${subtotal.toFixed(2)}</strong>
          </div>
          <button className="btn-primary w-full" style={{ marginTop: '1rem' }} onClick={handleCheckout} disabled={saving}>
            {saving ? 'Saving demo order…' : 'Checkout (Demo)'}
          </button>
        </div>
      )}
      <ShareNavatar open={shareOpen} onClose={() => setShareOpen(false)} />
    </main>
  );
}
