import { Link } from "react-router-dom";
import { Market } from "../../lib/marketplace/store";

export default function Cart() {
  const cart = Market.cart();
  const lines = cart.map(c => ({ ...c, product: Market.one(c.id)! }));
  return (
    <section>
      <h1>Cart</h1>
      {lines.length === 0 ? (
        <p>Your cart is empty. <Link to="/marketplace">Shop</Link></p>
      ) : (
        <>
          <ul>
            {lines.map(l => (
              <li key={l.id}>
                {l.product.name} × {l.qty} — ${(l.product.price*l.qty).toFixed(2)}{" "}
                <button onClick={() => { Market.remove(l.id); location.reload(); }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p><strong>Total: ${Market.total().toFixed(2)}</strong></p>
          <Link to="/marketplace/checkout">Proceed to checkout</Link>
        </>
      )}
    </section>
  );
}
