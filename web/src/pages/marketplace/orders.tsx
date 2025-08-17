import React from 'react';
import { loadOrders } from '../../lib/orders';

const EXP = import.meta.env.VITE_BLOCK_EXPLORER as string | undefined;

export default function OrdersPage() {
  const orders = loadOrders();

  if (!orders.length) {
    return (
      <section>
        <h1>Your orders</h1>
        <p>No orders yet.</p>
        <a href="/marketplace">Shop the marketplace</a>
      </section>
    );
  }

  return (
    <section>
      <h1>Your orders</h1>
      <ul>
        {orders.map(o => (
          <li key={o.id} style={{margin:'1rem 0', padding:'1rem', border:'1px solid #2a3355', borderRadius:8}}>
            <div><strong>Total:</strong> {o.totalNatur.toFixed(2)} NATUR</div>
            <div><strong>Date:</strong> {new Date(o.ts).toLocaleString()}</div>
            <details style={{marginTop:'.5rem'}}>
              <summary>Items</summary>
              <ul>
                {o.items.map(i => (
                  <li key={i.id}>{i.name} × {i.qty} — {(i.priceNatur*i.qty).toFixed(2)} NATUR</li>
                ))}
              </ul>
            </details>
            {o.txHash && EXP ? (
              <div style={{marginTop:'.5rem'}}>
                <a href={`${EXP}/tx/${o.txHash}`} target="_blank" rel="noreferrer">View on explorer</a>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
