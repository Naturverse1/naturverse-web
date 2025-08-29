import { useCart } from '../lib/cart';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function CartDrawer({ open, onClose }: {open: boolean, onClose: () => void}) {
  const { items, setQty, removeFromCart, clearCart, totalCents } = useCart();
  if (!open) return null;

  async function checkout() {
    const res = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map(i => ({ id: i.id, qty: i.qty })) }),
    });
    const { id, url } = await res.json();
    const stripe = await stripePromise;
    if (stripe && id) await stripe.redirectToCheckout({ sessionId: id });
    else if (url) location.href = url;
  }

  return (
    <div className="cart-drawer">
      <div className="cart-panel">
        <header><h3>Your cart</h3><button onClick={onClose}>×</button></header>
        {items.length === 0 ? <p>Empty</p> : (
          <ul>{items.map(i => (
            <li key={i.id}>
              <strong>{i.name}</strong> ${(i.price/100).toFixed(2)} x {i.qty}
              <button onClick={() => setQty(i.id, i.qty-1)}>-</button>
              <button onClick={() => setQty(i.id, i.qty+1)}>+</button>
              <button onClick={() => removeFromCart(i.id)}>Remove</button>
            </li>
          ))}</ul>
        )}
        <footer>
          <div>Subtotal ${(totalCents/100).toFixed(2)}</div>
          <button onClick={clearCart}>Clear</button>
          <button onClick={checkout} disabled={!items.length}>Checkout</button>
        </footer>
      </div>
    </div>
  );
}
