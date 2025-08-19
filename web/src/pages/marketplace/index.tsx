import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Product = { id: string; name: string; price_cents: number; image_url?: string };
export default function Marketplace() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(()=>{ (async () => {
    const { data } = await supabase.from("products").select("id,name,price_cents,image_url").limit(24);
    setItems((data as any) ?? []);
  })(); }, []);
  return (
    <section>
      <h2>🛒 Marketplace</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"1rem"}}>
        {items.map(p=>(
          <article key={p.id} style={{border:"1px solid #eee", padding:"0.75rem", borderRadius:8}}>
            {p.image_url && <img src={p.image_url} alt={p.name} style={{width:"100%",height:120,objectFit:"cover",borderRadius:6}} />}
            <h3 style={{margin:"0.5rem 0"}}>{p.name}</h3>
            <strong>${(p.price_cents/100).toFixed(2)}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
