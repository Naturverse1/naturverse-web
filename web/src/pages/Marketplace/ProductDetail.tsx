import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../types/commerce";
import ProductCard from "../../components/ProductCard";

export default function ProductDetail() {
  const id = useMemo(()=> new URLSearchParams(location.search).get("id") || "", []);
  const [p,setP]=useState<Product|undefined>();
  useEffect(()=>{ fetch("/content/products.json").then(r=>r.json()).then((all:Product[])=> setP(all.find(x=>x.id===id)));},[id]);
  if (!p) return <p>Loading…</p>;
  return (
    <section>
      <h1>{p.title}</h1>
      <ProductCard p={p} />
      <p>{p.desc}</p>
    </section>
  );
}

