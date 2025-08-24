import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Price from "../../components/commerce/Price";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { items, remove, total, clear } = useCart();
  return (
    <section>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "Cart", href: "/marketplace/cart" },
        ]}
      />
      <h1>Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {items.map((it) => (
              <li key={it.product.slug} className="card">
                <div className="img-wrap">
                  <img src={it.product.image} alt={it.product.name} />
                </div>
                <div>
                  <h3>{it.product.name}</h3>
                  <p>
                    Qty: {it.qty} — <Price amount={it.product.price * it.qty} />
                  </p>
                  <button
                    className="btn-secondary"
                    onClick={() => remove(it.product.slug)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h3>
            Total: <Price amount={total} />
          </h3>
          <Link to="/marketplace/checkout" className="btn">
            Checkout
          </Link>
          <button onClick={clear} className="btn-secondary" style={{ marginLeft: 8 }}>
            Clear
          </button>
        </>
      )}
    </section>
  );
}
