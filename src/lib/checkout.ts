import { cart } from './cart';

export async function startCheckout() {
  const items = cart.list();
  if (!items.length) {
    alert('Your cart is empty.');
    return;
  }

  const res = await fetch('/.netlify/functions/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });

  if (res.status === 501) {
    alert('Checkout disabled for preview.');
    return;
  }

  if (!res.ok) {
    alert('Checkout error.');
    return;
  }

  const { url } = (await res.json()) as { url?: string };
  if (url) {
    window.location.href = url;
  }
}
