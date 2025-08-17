import { Link } from 'react-router-dom';
import { listOrders } from '../../lib/orders';

export default function OrdersPage() {
  const orders = listOrders();
  return (
    <div className="page">
      <h1>Your Orders</h1>
      {orders.length === 0 && <p>No orders yet.</p>}
      <ul className="orders">
        {orders.map((o) => (
          <li key={o.id} className="order">
            <div>
              <b>{o.status}</b> • {new Date(o.ts).toLocaleString()}
              <div style={{ opacity: 0.8 }}>
                {o.items.map((i) => `${i.name}×${i.qty}`).join(', ')}
              </div>
            </div>
            <div>
              <b>{o.total.toFixed(2)} NATUR</b>
            </div>
            <div>
              <Link to={`/marketplace/orders/${o.id}`}>View →</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
