import { Link, useSearchParams } from 'react-router-dom';
import type { Order } from '../../types/marketplace';

export default function Orders() {
  const [sp] = useSearchParams();
  const recent = sp.get('id');
  const orders: Order[] = JSON.parse(localStorage.getItem('natur_orders') || '[]');

  return (
    <div className="container">
      <h2>Orders</h2>
      {!orders.length && (
        <p>
          No orders yet. <Link to="/marketplace">Shop →</Link>
        </p>
      )}
      {orders.map((o) => (
        <div key={o.id} className={`order ${recent === o.id ? 'new' : ''}`}>
          <div className="row">
            <div>#{o.id}</div>
            <div>{new Date(o.createdAt).toLocaleString()}</div>
            <div>
              <strong>{o.totalNatur} NATUR</strong>
            </div>
          </div>
          {o.items.map((i) => (
            <div key={i.id} className="row subrow">
              <img src={i.customization.navatarUrl} className="thumb" alt="" />
              <div>{i.title}</div>
              <div>
                {i.customization.size} {i.customization.color} {i.customization.material} ×{' '}
                {i.customization.qty}
              </div>
              <div>{i.lineNatur} NATUR</div>
            </div>
          ))}
        </div>
      ))}
      <Link to="/marketplace">Back to Marketplace</Link>
    </div>
  );
}
