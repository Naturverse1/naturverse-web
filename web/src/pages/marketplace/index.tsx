import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { fmtMoney } from "../../lib/marketplace";

type Product = { id:string; slug:string; title:string; description?:string; base_price_cents:number; preview_url?:string; };

export default function Marketplace(){
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(()=>{
    supabase.from("products").select("*").then(({data})=> setProducts(data||[]));
  },[]);
  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="text-3xl font-bold mb-2">🛒 Naturverse Marketplace</h1>
      <p className="opacity-80 mb-4">Create plushies, costumes, prints and more using your Navatar.</p>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {products.map(p=> (
          <Link key={p.id} to={`/marketplace/${p.slug}`} className="rounded-xl ring-1 ring-slate-700 bg-slate-900/60 p-3 hover:ring-slate-500">
            <div className="aspect-video rounded-lg bg-slate-800 mb-2 overflow-hidden">
              {p.preview_url ? <img src={p.preview_url} alt={p.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : null}
            </div>
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm opacity-80">{fmtMoney(p.base_price_cents)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
