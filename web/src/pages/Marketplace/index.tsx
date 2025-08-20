import { Link } from "react-router-dom";
import { Market } from "../../lib/marketplace/store";

export default function MarketplaceHome() {
  const items = Market.all();
  return (
    <section>
      <h1>Marketplace</h1>
      <p>Browse items and add to cart.</p>
      <nav style={{margin:"12px 0"}}>
        <Link to="cart">Cart</Link>{" · "}
        <Link to="orders">Orders</Link>
      </nav>
      <ul style={{listStyle:"none", padding:0}}>
        {items.map(p => (
          <li key={p.id} style={{margin:"16px 0"}}>
            <Link to={`product/${p.id}`} style={{fontWeight:600}}>{p.name}</Link>
            <div>${p.price.toFixed(2)}</div>
            <button onClick={() => { Market.add(p.id, 1); alert("Added to cart"); }}>
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
