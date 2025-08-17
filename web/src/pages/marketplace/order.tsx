import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, fmtDate, explorerUrl } from '../../lib/orders';
import { formatNatur, ShippingMethodId } from '../../lib/pricing';

export default function OrderDetailPage() {
  const { id = '' } = useParams();
  const order = useMemo(() => getOrder(id), [id]);

  const shipLabels: Record<ShippingMethodId, string> = {
    standard: 'Standard',
    expedited: 'Expedited',
  };

  if (!order) {
    return (
      <section>
        <a href="/marketplace/orders">← Back to Orders</a>
        <h1>Order not found</h1>
        <p>We couldn’t find that order in this browser.</p>
      </section>
    );
  }

  const txUrl = explorerUrl(order.txHash);

  return (
    <section>
      <a href="/marketplace/orders">← Back to Orders</a>
      <h1>Order {order.id}</h1>
      <p style={{ opacity: 0.9 }}>
        {fmtDate(order.createdAt)} · {order.network || '—'}
      </p>

      <h2>Items</h2>
      <div
        style={{ display: 'grid', gap: '.5rem', margin: '0.5rem 0 1rem' }}
      >
        {order.lines.map((l) => (
          <div
            key={l.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '.75rem',
              padding: '.5rem .75rem',
              background: 'rgba(255,255,255,.04)',
              borderRadius: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{l.name}</div>
              <small style={{ opacity: 0.8 }}>Unit {formatNatur(l.priceNatur)}</small>
            </div>
            <div style={{ justifySelf: 'end' }}>Qty {l.qty}</div>
            <div style={{ justifySelf: 'end', fontWeight: 600 }}>
              {formatNatur(l.qty * l.priceNatur)}
            </div>
          </div>
        ))}
      </div>

        <h2>Totals</h2>
        <div className="totals" style={{ marginBottom: '1rem' }}>
          <div className="row">
            <span>Items</span>
            <span>{formatNatur(order.totals?.items ?? order.totalNatur)}</span>
          </div>
          <div className="row">
            <span>Shipping ({shipLabels[order.shippingMethod] || ''})</span>
            <span>{formatNatur(order.totals?.shipping ?? 0)}</span>
          </div>
          {order.totals?.discount ? (
            <div className="row">
              <span>Discount</span>
              <span>-{formatNatur(order.totals.discount)}</span>
            </div>
          ) : null}
          <div className="row grand">
            <span>Total</span>
            <span>{formatNatur(order.totals?.grandTotal ?? order.totalNatur)}</span>
          </div>
        </div>

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

        <h2>Transaction</h2>
      {order.txHash ? (
        <p>
          Hash: <code>{order.txHash}</code>
          <br />
          {txUrl && (
            <a href={txUrl} target="_blank" rel="noreferrer">
              View on Explorer ↗
            </a>
          )}
        </p>
      ) : (
        <p>No transaction hash recorded.</p>
      )}

      {order.address && (
        <>
          <h2>Buyer</h2>
          <p>
            <small>Wallet:</small> <code>{order.address}</code>
          </p>
        </>
      )}
    </section>
  );
}

