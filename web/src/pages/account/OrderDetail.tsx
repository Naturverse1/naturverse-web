import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderById, reorder } from '../../lib/account';
import { explorerUrl } from '../../lib/orders';
import { formatNatur } from '../../lib/pricing';

export default function OrderDetail() {
  const { id = '' } = useParams();
  const order = useMemo(() => getOrderById(id), [id]);
  const nav = useNavigate();

  if (!order) {
    return (
      <section>
        <a href="/account/orders">← Back to Orders</a>
        <h1>Order not found</h1>
        <p>We couldn’t find that order in this browser.</p>
      </section>
    );
  }

  const doReorder = () => {
    reorder(order);
    const added = order.lines.reduce((s, l) => s + l.qty, 0);
    alert(`Re-added ${added} items to your cart.`);
    nav('/marketplace/cart');
  };

  const shipLabels: Record<string, string> = {
    standard: 'Standard',
    expedited: 'Expedited',
  };
  const txUrl = explorerUrl(order.txHash);

  return (
    <section>
      <a href="/account/orders">← Back to Orders</a>
      <h1>Order {order.id}</h1>
      <p style={{ opacity: 0.9 }}>{new Date(order.createdAt).toLocaleString()}</p>

      <h2>Items</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Variant</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Line</th>
          </tr>
        </thead>
        <tbody>
          {order.lines.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td>
              <td>{l.meta?.variant || ''}</td>
              <td>{l.qty}</td>
              <td>{formatNatur(l.priceNatur)}</td>
              <td>{formatNatur(l.priceNatur * l.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Totals</h2>
      <table className="table">
        <tbody>
          <tr>
            <td>Items</td>
            <td>{formatNatur(order.totals?.items ?? order.totalNatur)}</td>
          </tr>
          {order.totals?.shipping !== undefined && (
            <tr>
              <td>Shipping ({shipLabels[order.shippingMethod] || ''})</td>
              <td>{formatNatur(order.totals.shipping)}</td>
            </tr>
          )}
          {order.totals?.discount && (
            <tr>
              <td>Discount</td>
              <td>-{formatNatur(order.totals.discount)}</td>
            </tr>
          )}
          <tr>
            <td>Grand total</td>
            <td>{formatNatur(order.totals?.grandTotal ?? order.totalNatur)}</td>
          </tr>
        </tbody>
      </table>

      {order.shipping && (
        <>
          <h2>Shipping</h2>
          <p>{shipLabels[order.shippingMethod] || ''}</p>
          <p style={{ whiteSpace: 'pre-line' }}>
            {order.shipping.fullName}
            {'\n'}
            {order.shipping.address1}
            {order.shipping.address2 ? `\n${order.shipping.address2}` : ''}
            {'\n'}
            {order.shipping.city}, {order.shipping.state} {order.shipping.postal}
            {'\n'}
            {order.shipping.country}
            {'\n'}
            {order.shipping.email}
            {order.shipping.phone ? `\n${order.shipping.phone}` : ''}
          </p>
        </>
      )}

      {order.txHash && (
        <>
          <h2>Transaction</h2>
          <p>
            Hash: <code>{order.txHash}</code>
            <br />
            {txUrl && (
              <a href={txUrl} target="_blank" rel="noreferrer">
                View on Explorer ↗
              </a>
            )}
          </p>
        </>
      )}

      <div className="actions" style={{ marginTop: '1rem' }}>
        <button onClick={doReorder}>Reorder</button>
        <Link to="/account/orders">Go to Orders</Link>
        <Link to="/marketplace">Continue Shopping</Link>
      </div>
    </section>
  );
}
