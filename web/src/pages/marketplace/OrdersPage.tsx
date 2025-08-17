import React from "react";
import { Link } from "react-router-dom";

const EXPLORER = import.meta.env.VITE_BLOCK_EXPLORER as string | undefined;

export default function OrdersPage() {
  const orders = JSON.parse(localStorage.getItem("natur_orders") || "[]") as any[];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {!orders.length && <div>No orders yet.</div>}

      {orders.map((o) => (
        <div key={o.id} className="mb-6 border-b pb-4">
          <div className="font-medium">
            #{o.id} — {o.total?.toFixed ? o.total.toFixed(2) : o.total} NATUR
          </div>
          <div className="text-sm opacity-75">{new Date(o.ts).toLocaleString()}</div>

          <Link to={`/marketplace/orders/${o.id}`} className="underline">
            View →
          </Link>

          {o.txHash && (
            <div className="text-sm mt-1">
              Tx: {EXPLORER ? (
                <a href={`${EXPLORER}/tx/${o.txHash}`} target="_blank" rel="noreferrer">
                  {o.txHash.slice(0, 10)}…
                </a>
              ) : (
                o.txHash
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
