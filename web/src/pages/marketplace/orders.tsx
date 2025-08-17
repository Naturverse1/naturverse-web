import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { loadOrders, fmtDate } from '../../lib/orders';
import { fmtNatur } from '../../lib/money';

export default function OrdersPage() {
  const orders = useMemo(() => loadOrders(), []);
  return (
    <section>
      <a href="/marketplace">← Back to Marketplace</a>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>
          No orders yet. After a successful NATUR payment,
          your orders will appear here.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/marketplace/orders/${encodeURIComponent(o.id)}`}
              style={{
                padding: '0.9rem 1rem',
                background: 'rgba(255,255,255,.04)',
                borderRadius: 12,
                textDecoration: 'none',
                color: 'inherit',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '.5rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>Order {o.id.slice(0, 8)}…</div>
                <div style={{ opacity: 0.8, fontSize: '.9rem' }}>
                  {fmtDate(o.createdAt)} · {o.network || '—'}
                </div>
              </div>
              <div style={{ alignSelf: 'center', fontWeight: 600 }}>
                {fmtNatur(o.totalNatur)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

