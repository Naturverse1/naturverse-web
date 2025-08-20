import { useEffect, useState } from "react";
import { getDeviceId } from "../../lib/device";

export default function Profile() {
  const dev = getDeviceId();
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(()=>{ fetch(`/.netlify/functions/orders?device=${dev}`).then(r=>r.json()).then(setOrders); },[]);
  return (
    <section>
      <h1>Profile & Settings</h1>
      <h3>Orders</h3>
      {orders.length===0 ? <p>No orders yet.</p> :
        <ul>{orders.map(o=> <li key={o.id}>{new Date(o.created_at).toLocaleString()} — {o.total_tokens} NATUR</li>)}</ul>}
    </section>
  );
}
