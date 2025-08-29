import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/lib/auth-context';
import { setTitle } from './_meta';

type Order = {
  id: string;
  created_at: string;
  amount_total: number;
  currency: string;
  status: string;
  line_items: { product?: string; description?: string; quantity?: number; amount_total?: number }[];
};

export default function OrdersPage() {
  setTitle('Orders');
  const { ready, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user || !supabase) return;
    (async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setOrders(data as any);
      setFetching(false);
    })();
  }, [user?.id]);

  if (!ready) return <div className="container">Loading…</div>;
  if (!user) return <div className="container">Please sign in to view your orders.</div>;

  return (
    <div className="container">
      <h1>Your Orders</h1>
      {fetching && <p>Loading orders…</p>}
      {orders.length === 0 && !fetching && <p>No orders yet.</p>}
      <ul className="orders-list">
        {orders.map(o => (
          <li key={o.id} className="order-card">
            <div className="row">
              <strong>{(o.amount_total/100).toFixed(2)} {o.currency.toUpperCase()}</strong>
              <span>{new Date(o.created_at).toLocaleString()}</span>
              <span className={`badge ${o.status}`}>{o.status}</span>
            </div>
            <ul className="items">
              {o.line_items?.map((li, i) => (
                <li key={i}>
                  {(li.product || li.description) ?? 'Item'} × {li.quantity ?? 1}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
