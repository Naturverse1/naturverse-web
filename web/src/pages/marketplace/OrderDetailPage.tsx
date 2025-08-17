import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../lib/orders';

export default function OrderDetailPage() {
  const { id } = useParams();
  const o = getOrder(id!);
  if (!o)
    return (
      <div className="page">
        <p>Order not found.</p>
        <Link to="/marketplace/orders">Back</Link>
      </div>
    );
  return (
    <div className="page">
      <h1>Order #{o.id.slice(0, 6)}</h1>
      <div>
        Status: <b>{o.status}</b>
      </div>
      {o.txHash && (
        <div>
          Tx:{' '}
          <a
            href={
              import.meta.env.VITE_BLOCK_EXPLORER
                ? `${import.meta.env.VITE_BLOCK_EXPLORER}/tx/${o.txHash}`
                : '#'
            }
            target="_blank"
          >
            {o.txHash.slice(0, 10)}…
          </a>
        </div>
      )}
      <div>Date: {new Date(o.ts).toLocaleString()}</div>
      <h3 style={{ marginTop: 16 }}>Items</h3>
      <ul>
        {o.items.map((i) => (
          <li key={i.id} className="cart-line">
            <img
              src={i.previewUrl || i.thumb}
              alt=""
              className="preview-thumb"
            />
            <div>
              {i.name} × {i.qty} — {(i.price * i.qty).toFixed(2)} NATUR
              {i.options && (
                <small style={{ marginLeft: 8, opacity: 0.8 }}>
                  {Object.entries(i.options)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </small>
              )}
            </div>
          </li>
        ))}
      </ul>
      <h3>Totals</h3>
      <div>Subtotal: {o.subtotal.toFixed(2)} NATUR</div>
      <div>Fee: {o.fee.toFixed(2)} NATUR</div>
      <div>
        <b>Total: {o.total.toFixed(2)} NATUR</b>
      </div>
      <p style={{ marginTop: 16 }}>
        <Link to="/marketplace/orders">← Back to orders</Link>
      </p>
    </div>
  );
}
