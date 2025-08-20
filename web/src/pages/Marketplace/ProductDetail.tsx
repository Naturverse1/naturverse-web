import { useParams, Link } from "react-router-dom";
import { Market } from "../../lib/marketplace/store";

export default function ProductDetail() {
  const { id } = useParams();
  const p = id ? Market.one(id) : undefined;

  if (!p) return <p>Product not found.</p>;

  return (
    <section>
      <h1>{p.name}</h1>
      {p.image && <img src={p.image} alt={p.name} style={{maxWidth:240}}/>}
      <p>{p.description}</p>
      <p><strong>${p.price.toFixed(2)}</strong></p>
      <button onClick={() => { Market.add(p.id, 1); alert("Added to cart"); }}>
        Add to cart
      </button>
      <div style={{marginTop:12}}>
        <Link to="/marketplace">Back</Link>
      </div>
    </section>
  );
}
