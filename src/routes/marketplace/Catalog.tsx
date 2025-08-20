import { Link } from "react-router-dom";
import { LOCAL_PRODUCTS } from "../../data/local";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

type P = { id:string; name:string; price:number; emoji?:string; desc?:string };

export default function MarketCatalog(){
  const [items,setItems]=useState<P[]|null>(null);

  useEffect(()=>{
    (async ()=>{
      if (!supabase) return setItems(LOCAL_PRODUCTS);
      const { data, error } = await supabase.from("nv_products").select("*").order("name");
      setItems(error? LOCAL_PRODUCTS : (data as P[]));
    })();
  },[]);

  const list = items ?? LOCAL_PRODUCTS;
  return (
    <ul className="cards">
      {list.map(p=>(
        <li key={p.id} className="card">
          <Link to={`/marketplace/product/${p.id}`} className="card-link">
            <div className="card-emoji">{p.emoji || "🛒"}</div>
            <div>
              <div className="card-title">{p.name}</div>
              <div className="card-sub">${p.price} · {p.desc}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
