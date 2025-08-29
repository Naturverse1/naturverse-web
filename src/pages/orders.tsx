import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { setTitle } from './_meta';
import { supabase } from '../lib/supabase';

const DIGITAL = new Set(["navatar-style-kit", "breathwork-starter"]);
const NAME_TO_SKU: Record<string, string> = {
  "Navatar Style Kit": "navatar-style-kit",
  "Breathwork Starter Pack": "breathwork-starter",
};

async function downloadFor(orderId: string, sku: string) {
  const { data: session } = await supabase!.auth.getSession();
  const token = session.session?.access_token || "";
  const res = await fetch(`/.netlify/functions/get-download-url?sku=${sku}&order=${orderId}`, {
    headers: { "x-supabase-token": token },
  });
  if (!res.ok) return alert(await res.text());
  const { url } = await res.json();
  window.location.href = url;
}

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
              {o.line_items?.map((li, i) => {
                const sku = (li as any).sku || NAME_TO_SKU[(li as any).product || (li as any).description || ""];
                const isDigital = sku && DIGITAL.has(sku);
                return (
                  <li key={i}>
                    {(li.product || li.description) ?? 'Item'} × {li.quantity ?? 1}
                    {isDigital && (
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => downloadFor(o.id, sku!)}
                        aria-label="Download"
                      >
                        Download
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
