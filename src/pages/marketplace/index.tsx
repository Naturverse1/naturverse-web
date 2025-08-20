import { useEffect, useState } from "react";
import type { Product } from "../../types/commerce";
import TokenBalance from "../../components/TokenBalance";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(()=>{ fetch("/content/products.json").then(r=>r.json()).then(setProducts); }, []);
  return (
    <section>
      <h1>Marketplace</h1>
      <p><TokenBalance /> · <Link to="/marketplace/cart">Cart</Link></p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {products.map(p => (
          <Link key={p.id} to={`/marketplace/productdetail?id=${encodeURIComponent(p.id)}`} style={{textDecoration:"none",color:"inherit"}}>
            <ProductCard p={p} />
          </Link>
        ))}
      </div>
    </section>
  );
}

