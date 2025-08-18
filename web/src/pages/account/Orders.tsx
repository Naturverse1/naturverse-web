import { useEffect, useState } from 'react';
import { getOrders } from '../../lib/orders';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/ui/Skeleton';

export default function Orders() {
  const [list, setList] = useState(getOrders());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="container" style={{ padding: '24px' }}>
      <h1>Your Orders</h1>
      {loading ? (
        <div className="panel">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : !list.length ? (
        <p>
          No orders yet.{' '}
          <Link to="/marketplace" style={{ color: '#7fe3ff' }}>
            Go shop
          </Link>
          .
        </p>
      ) : (
        <div className="panel">
          {list.map((o, i) => (
            <Link key={i} to={`/account/orders/${o.id}`} className="order">
              <div className="muted small">
                {new Date(o.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>#{o.id.slice(0, 8)}</strong> • {o.lines.length} item(s) •{' '}
                <strong>${o.amounts.total.toFixed(2)}</strong>
              </div>
              <div className="muted small">
                {o.shippingName} — {o.shippingAddress}
              </div>
              <div className="thumbs">
                {o.lines.slice(0, 6).map((l, j) =>
                  l.image ? (
                    <img key={j} src={l.image} alt="" />
                  ) : (
                    <div key={j} className="ph" />
                  )
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
