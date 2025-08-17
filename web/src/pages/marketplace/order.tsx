import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, fmtDate, explorerUrl } from '../../lib/orders';
import { fmtNatur } from '../../lib/money';

export default function OrderDetailPage() {
  const { id = '' } = useParams();
  const order = useMemo(() => getOrder(id), [id]);

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
              <small style={{ opacity: 0.8 }}>Unit {fmtNatur(l.priceNatur)}</small>
            </div>
            <div style={{ justifySelf: 'end' }}>Qty {l.qty}</div>
            <div style={{ justifySelf: 'end', fontWeight: 600 }}>
              {fmtNatur(l.qty * l.priceNatur)}
            </div>
          </div>
        ))}
      </div>

        <h2>Total</h2>
        <p style={{ fontWeight: 700 }}>{fmtNatur(order.totalNatur)}</p>

        {order.shipping && (
          <>
            <h2>Shipping</h2>
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

