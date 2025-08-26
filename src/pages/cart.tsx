import { useCart } from '../lib/cart';
import Breadcrumbs from '../components/Breadcrumbs';

export default function CartPage() {
  const { items, inc, dec, remove, subtotal } = useCart();
  return (
    <main data-page="cart" className="nvrs-section cart cart-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <h1>Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="nv-card">
          {items.map((it) => (
            <div
              key={it.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '64px 1fr auto',
                gap: '1rem',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <img src={it.image} alt="" width="64" height="64" style={{ objectFit: 'contain' }} />
              <div>
                <div>{it.name}</div>
                <div className="price">${it.price.toFixed(2)}</div>
                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.25rem' }}>
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
              <div className="price">${(it.qty * it.price).toFixed(2)}</div>
            </div>
          ))}
          <hr />
          <div className="subtotal" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Subtotal</strong>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <button className="btn-primary w-full" style={{ marginTop: '1rem' }}>
            Checkout (stub)
          </button>
        </div>
      )}
    </main>
  );
}
