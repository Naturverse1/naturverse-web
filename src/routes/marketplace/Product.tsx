import { useParams, Link } from "react-router-dom";
import { useStore } from "../../store/Store";
import { LOCAL_PRODUCTS } from "../../data/local";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type P = { id:string; name:string; price:number; emoji?:string; desc?:string };

export default function MarketProduct(){
  const { id } = useParams();
  const { dispatch } = useStore();
  const [item,setItem]=useState<P | null>(null);

  useEffect(()=>{
    (async()=>{
      if (!id) return;
      if (!supabase){
        setItem(LOCAL_PRODUCTS.find(p=>p.id===id) || null);
      } else {
        const { data, error } = await supabase.from("nv_products").select("*").eq("id", id).single();
        if (error) setItem(LOCAL_PRODUCTS.find(p=>p.id===id) || null);
        else setItem(data as P);
      }
    })();
  },[id]);

  if (!item) return <p>Product not found.</p>;
  return (
    <>
      <p><Link to="/marketplace">← Back to catalog</Link></p>
      <h3>{item.emoji || "🛒"} {item.name}</h3>
      <p className="muted">{item.desc}</p>
      <p><strong>${item.price}</strong></p>
      <button onClick={()=>dispatch({type:"add", item})}>Add to cart</button>
    </>
  );
}
