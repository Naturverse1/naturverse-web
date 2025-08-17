import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShippingForm, { ShippingFormProps } from '../../../components/checkout/ShippingForm';
import type { Shipping } from '../../../lib/orders';
import { useCart } from '../../../context/CartContext';
import { getDefaultAddress } from '../../../lib/account';

function loadShipping(): Shipping {
  try {
    const raw = localStorage.getItem('natur_shipping');
    if (raw) {
      const parsed = { country: 'US', ...JSON.parse(raw) } as Shipping;
      const hasData = Object.values(parsed).some((v) => String(v).trim());
      if (hasData) return parsed;
    }
    const def = getDefaultAddress();
    if (def) return { ...def };
  } catch {}
  return {
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postal: '',
    country: 'US',
  };
}

export default function ShippingPage() {
  const nav = useNavigate();
  const [value, setValue] = useState<Shipping>(loadShipping());
  const { items } = useCart();
  const defaultAddr = getDefaultAddress();

  useEffect(() => {
    if (items.length === 0) {
      alert('Your cart is empty.');
      nav('/marketplace', { replace: true });
    }
  }, [items, nav]);

  const props: ShippingFormProps = {
    value,
    onChange: setValue,
    onContinue: () => nav('/marketplace/checkout/review'),
  };

  return (
    <section>
      <a href="/marketplace/cart">← Back to Cart</a>
      <h1>Shipping</h1>
      {defaultAddr && (
        <button
          onClick={() => defaultAddr && setValue({ ...defaultAddr })}
          disabled={JSON.stringify(value) === JSON.stringify(defaultAddr)}
          style={{ marginBottom: 8 }}
        >
          Use default address
        </button>
      )}
      <ShippingForm {...props} />
    </section>
  );
}

