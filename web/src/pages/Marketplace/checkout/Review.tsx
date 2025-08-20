import { Link } from "react-router-dom";
import { Market } from "../../../lib/marketplace/store";

export default function Review() {
  const cart = Market.cart();
  const total = Market.total();
  return (
    <div>
      <h2>Review</h2>
      <ul>
        {cart.map(c => {
          const p = Market.one(c.id)!;
          return <li key={c.id}>{p.name} × {c.qty}</li>;
        })}
      </ul>
      <p><strong>Total: ${total.toFixed(2)}</strong></p>
      <Link to="/marketplace/success" onClick={() => Market.clear()}>Place order</Link>
    </div>
  );
}
