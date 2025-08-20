import { useParams, Link } from "react-router-dom";
import { Market } from "../../lib/marketplace/store";

export default function OrderDetail() {
  const { id } = useParams();
  const o:any = id ? Market.order(id) : null;
  if (!o) return <p>Order not found.</p>;
  return (
    <section>
      <h1>Order {o.id}</h1>
      <p>Status: {o.status}</p>
      <ul>
        {o.items.map((it:any) => {
          const p = Market.one(it.id)!;
          return <li key={it.id}>{p.name} × {it.qty}</li>;
        })}
      </ul>
      <p><strong>Total: ${o.total.toFixed(2)}</strong></p>
      <Link to="/marketplace/orders">Back</Link>
    </section>
  );
}
