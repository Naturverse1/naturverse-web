import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShippingForm, { ShippingFormProps } from '../../../components/checkout/ShippingForm';
import type { Shipping } from '../../../lib/orders';

function loadShipping(): Shipping {
  try {
    const raw = localStorage.getItem('natur_shipping');
    if (raw) return { country: 'US', ...JSON.parse(raw) } as Shipping;
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

  const props: ShippingFormProps = {
    value,
    onChange: setValue,
    onContinue: () => nav('/marketplace/checkout/review'),
  };

  return (
    <section>
      <a href="/marketplace/cart">← Back to Cart</a>
      <h1>Shipping</h1>
      <ShippingForm {...props} />
    </section>
  );
}

