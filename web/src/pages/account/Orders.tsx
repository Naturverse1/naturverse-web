import { getOrders } from '../../lib/orders';
import { Link } from 'react-router-dom';

export default function Orders() {
  const list = getOrders();
  return (
    <div className="container" style={{ padding: '24px' }}>
      <h1>Your Orders</h1>
      {!list.length ? (
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

