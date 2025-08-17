import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, fmtDate, explorerUrl } from '../../lib/orders';
import { formatNatur, ShippingMethodId } from '../../lib/pricing';
import RecoStrip from '../../components/RecoStrip';
import { recommendForCats, Item } from '../../lib/reco';
import { PRODUCTS } from '../../lib/products';

const allItems: Item[] = PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  price: p.baseNatur,
  category: p.category,
  image: p.img,
  createdAt: p.createdAt,
}));

export default function OrderSuccess() {
  const { id = '' } = useParams();
  const order = useMemo(() => getOrder(id), [id]);

  const shipLabels: Record<ShippingMethodId, string> = {
    standard: 'Standard',
    expedited: 'Expedited',
  };

  if (!order) {
    return (
      <section className="receipt">
        <h1>Order not found</h1>
        <p>We couldn’t find that order in this browser.</p>
        <p>
          <a href="/marketplace/orders">Go to Orders</a> ·{' '}
          <a href="/marketplace">Continue Shopping</a>
        </p>
      </section>
    );
  }

  const txUrl = explorerUrl(order.txHash);
  const cats = useMemo(() => {
    return Array.from(
      new Set(
        order.lines
          .map(l => {
            const pid = l.id.split('::')[0];
            return PRODUCTS.find(p => p.id === pid)?.category;
          })
          .filter(Boolean) as string[],
      ),
    );
  }, [order]);
  const recos = recommendForCats(cats, allItems, 6);

  return (
    <section>
      <style>{`
@media print {
  nav, .nav, .button, .cta-row, .no-print { display: none !important; }
  .receipt { box-shadow: none; border: 1px solid #ccc; }
  body { background: #fff; color: #000; }
}
`}</style>
      <div
        className="receipt"
        style={{
          maxWidth: 680,
          margin: '1rem auto',
          padding: '1rem',
          background: 'var(--panel)',
          border: '1px solid var(--panel-b)',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,.2)',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>
          Payment confirmed ✅
        </h1>
        <p style={{ opacity: 0.8 }}>{fmtDate(order.createdAt)}</p>

        <table style={{ width: '100%', margin: '1rem 0', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Item</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l) => (
              <tr key={l.id}>
                <td>
                  {l.name}
                  {l.meta?.variant ? ` (${l.meta.variant})` : ''}
                </td>
                <td style={{ textAlign: 'right' }}>{l.qty}</td>
                <td style={{ textAlign: 'right' }}>
                  {formatNatur(l.qty * l.priceNatur)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ margin: '1rem 0' }}>
          <div>Shipping: {shipLabels[order.shippingMethod] || ''}</div>
          {order.discount && (
            <div>Discount: -{formatNatur(order.discount.amount)}</div>
          )}
          <div style={{ fontWeight: 600 }}>
            Total: {formatNatur(order.totals?.grandTotal ?? order.totalNatur)}
          </div>
          {order.txHash && (
            <div>
              Tx:{' '}
              {txUrl ? (
                <a href={txUrl} target="_blank" rel="noreferrer">
                  {order.txHash}
                </a>
              ) : (
                <code>{order.txHash}</code>
              )}
            </div>
          )}
        </div>

        <div style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>
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
        </div>

        <div className="cta-row" style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <a className="button" href={`/marketplace/orders/${encodeURIComponent(order.id)}`}>
            View Order
          </a>
          <a className="button" href="/marketplace/orders">
            Go to Orders
          </a>
          <a className="button" href="/marketplace">
            Continue Shopping
          </a>
          <button className="button" onClick={() => window.print()}>
            Print Receipt
          </button>
        </div>
      </div>
      <RecoStrip title="You might also like" items={recos} source="success" />
    </section>
  );
}

