import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function OrderDetailPage() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  useEffect(() => {
    nav(`/account/orders/${encodeURIComponent(id)}`, { replace: true });
  }, [nav, id]);
  return null;
}
