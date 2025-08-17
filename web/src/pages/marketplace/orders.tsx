import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const nav = useNavigate();
  useEffect(() => {
    nav('/account/orders', { replace: true });
  }, [nav]);
  return null;
}
