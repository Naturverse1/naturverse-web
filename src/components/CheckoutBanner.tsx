import { useEffect, useState } from 'react';

export default function CheckoutBanner() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') setMsg('✅ Payment successful! Thank you.');
    if (params.get('checkout') === 'cancel') setMsg('❌ Payment canceled. Please try again.');
  }, []);

  if (!msg) return null;
  return <div className="checkout-banner">{msg}</div>;
}

