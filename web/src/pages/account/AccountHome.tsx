import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrders, reorder } from '../../lib/account';
import type { Order } from '../../lib/types';
import { formatNatur } from '../../lib/pricing';

export default function AccountHome() {
  const { user } = useAuth();
  const orders = useMemo(() => getOrders().slice(0, 5), []);
  const nav = useNavigate();

  const navatar = (() => {
    try {
      return localStorage.getItem('navatar_url');
    } catch {
      return null;
    }
  })();

  const doReorder = (o: Order) => {
    reorder(o);
    const added = o.lines.reduce((s, l) => s + l.qty, 0);
    alert(`Re-added ${added} items to your cart.`);
    nav('/marketplace/cart');
  };

  return (
    <section>
      <h1>Account</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        {navatar && (
          <img src={navatar} alt="Navatar" width={40} height={40} style={{ borderRadius: '50%' }} />
        )}
        <div>{user?.email}</div>
      </div>
      <nav className="actions" style={{ marginBottom: '1.5rem' }}>
        <Link to="/account/orders">Orders</Link>
        <Link to="/account/addresses">Addresses</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/marketplace">Marketplace</Link>
      </nav>
      {orders.length > 0 && (
        <>
          <h2>Recent Orders</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/account/orders/${encodeURIComponent(o.id)}`}>{o.id}</Link>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{formatNatur(o.totals?.grandTotal ?? o.totalNatur)}</td>
                  <td>Paid</td>
                  <td className="actions">
                    <Link to={`/account/orders/${encodeURIComponent(o.id)}`}>View</Link>
                    <button onClick={() => doReorder(o)}>Reorder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
