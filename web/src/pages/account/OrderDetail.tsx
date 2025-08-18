import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../../lib/orders';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/useToast';

export default function OrderDetail() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const [order] = useState(() => getOrders().find((o) => o.id === id));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      if (!order) {
        toast.error('Order not found');
        nav('/account/orders');
      }
    }, 300);
    return () => clearTimeout(t);
  }, [order, nav, toast]);

  if (loading) {
    return (
      <section className="page-container">
        <Skeleton className="h-32" />
      </section>
    );
  }

  if (!order) return null;

  return (
    <section className="page-container">
      <Link to="/account/orders">← Back to Orders</Link>
      <h1>Order #{order.id.slice(0, 8)}</h1>
      <p className="muted" style={{ marginBottom: '1rem' }}>
        {new Date(order.createdAt).toLocaleString()} • ${order.amounts.total.toFixed(2)}
      </p>

      <h2>Contact</h2>
      <p>{order.email}</p>

      <h2>Shipping</h2>
      <p>{order.shippingName}<br />{order.shippingAddress}</p>

      <h2>Items</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((l) => (
            <tr key={l.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {l.image && (
                    <img
                      src={l.image}
                      alt=""
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                  {l.name}
                </div>
              </td>
              <td>{l.qty}</td>
              <td>${l.price.toFixed(2)}</td>
              <td>${(l.price * l.qty).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
