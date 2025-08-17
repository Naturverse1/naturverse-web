import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders, reorder } from '../../lib/account';
import type { Order } from '../../lib/types';
import { formatNatur } from '../../lib/pricing';

const PAGE_SIZE = 10;

export default function OrdersList() {
  const orders = useMemo(() => getOrders(), []);
  const [page, setPage] = useState(0);
  const nav = useNavigate();

  const start = page * PAGE_SIZE;
  const pageOrders = orders.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  const doReorder = (o: Order) => {
    reorder(o);
    const added = o.lines.reduce((s, l) => s + l.qty, 0);
    alert(`Re-added ${added} items to your cart.`);
    nav('/marketplace/cart');
  };

  return (
    <section>
      <a href="/account">← Back to Account</a>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageOrders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/account/orders/${encodeURIComponent(o.id)}`}>{o.id}</Link>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{o.lines.reduce((s, l) => s + l.qty, 0)}</td>
                  <td>{formatNatur(o.totals?.grandTotal ?? o.totalNatur)}</td>
                  <td>Paid</td>
                  <td className="actions">
                    <button onClick={() => doReorder(o)}>Reorder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="actions" style={{ marginTop: '1rem' }}>
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Prev
              </button>
              <div>
                Page {page + 1} / {totalPages}
              </div>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
