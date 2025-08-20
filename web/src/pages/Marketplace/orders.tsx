import { Link } from "react-router-dom";
import { Market } from "../../lib/marketplace/store";

export default function Orders() {
  const list:any[] = Market.orders();
  return (
    <section>
      <h1>Orders</h1>
      {!list.length ? <p>No orders yet.</p> : (
        <ul>
          {list.map(o => (
            <li key={o.id}>
              <Link to={`/marketplace/order/${o.id}`}>{o.id}</Link> — {o.status} — ${o.total.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
