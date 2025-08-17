import React from 'react';
import { Navigate } from 'react-router-dom';

export default function CheckoutIndex() {
  let hasShipping = false;
  try {
    hasShipping = !!localStorage.getItem('natur_shipping');
  } catch {}
  return (
    <Navigate
      to={hasShipping ? '/marketplace/checkout/review' : '/marketplace/checkout/shipping'}
      replace
    />
  );
}

