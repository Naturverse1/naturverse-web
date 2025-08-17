import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { getCart, saveCart, fmtMoney, CartItem } from "../../lib/marketplace";

type Product={ id:string; slug:string; title:string; description?:string; base_price_cents:number; category:string; preview_url?:string; };
type Variant={ id:string; product_id:string; name:string; price_cents:number; sku?:string; };

export default function ProductPage(){
  const { slug } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState<Product|null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [navatarUrl, setNavatarUrl] = useState("");
  const [embText, setEmbText] = useState("");

  useEffect(()=>{
    (async ()=>{
      const { data: prods } = await supabase.from("products").select("*").eq("slug", slug!).limit(1);
      if(prods && prods[0]) {
        setProduct(prods[0]);
        const { data: vars } = await supabase.from("product_variants").select("*").eq("product_id", prods[0].id);
        setVariants(vars||[]);
        setVariantId(vars?.[0]?.id || "");
      }
      const u = await supabase.auth.getUser();
      const uid = u.data.user?.id;
      if(uid){
        const { data: prof } = await supabase.from("users").select("avatar_url").eq("id", uid).limit(1);
        if(prof && prof[0]?.avatar_url) setNavatarUrl(prof[0].avatar_url);
      }
    })();
  },[slug]);

  const variant = useMemo(()=> variants.find(v=>v.id===variantId) || variants[0], [variants, variantId]);
  if(!product || !variant) return <>Loading…</>;

  function addToCart(){
    const items = getCart();
    const item: CartItem = { product, variant, qty, navatar_url: navatarUrl || undefined, personalization: { embroidery: embText } };
    items.push(item);
    saveCart(items);
    nav("/marketplace/cart");
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <Link to="/marketplace" className="text-sm opacity-80 hover:underline">← Back to Marketplace</Link>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="flex items-center justify-center bg-slate-900/60 rounded-lg p-4 min-h-[260px]">
          {navatarUrl ? <img src={navatarUrl} alt="Navatar" className="max-w-full max-h-full rounded-lg"/> : <div>No Navatar yet</div>}
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold">{product.title}</div>
            <div className="opacity-80">{variant.name}</div>
            <div className="text-xl mt-2">{fmtMoney(variant.price_cents)}</div>
            <div className="text-sm opacity-80">Preview only. Final may vary slightly.</div>
          </div>
          <div>
            <div className="font-semibold">{product.title}</div>
            <div className="text-sm opacity-80">{product.description}</div>
          </div>
          <div>
            <label className="font-semibold">Variant</label>
            <select value={variantId} onChange={(e)=>setVariantId(e.target.value)} className="w-full rounded-md bg-slate-900/60 ring-1 ring-slate-700 p-2 mt-1">
              {variants.map(v=> (
                <option key={v.id} value={v.id}>{v.name} — {fmtMoney(v.price_cents)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold">Use Navatar URL (auto-filled if you have one)</label>
            <input value={navatarUrl} onChange={(e)=>setNavatarUrl(e.target.value)} placeholder="https://…" className="w-full rounded-md bg-slate-900/60 ring-1 ring-slate-700 p-2 mt-1"/>
            <p className="text-sm opacity-80">We’ll print/sew from this image. PNG/JPG recommended.</p>
          </div>
          <div>
            <label className="font-semibold">Embroidery text (optional)</label>
            <input value={embText} onChange={(e)=>setEmbText(e.target.value)} maxLength={16} className="w-full rounded-md bg-slate-900/60 ring-1 ring-slate-700 p-2 mt-1"/>
          </div>
          <div>
            <label className="font-semibold">Quantity</label>
            <input type="number" min={1} value={qty} onChange={(e)=>setQty(Math.max(1, Number(e.target.value)||1))} className="w-28 rounded-md bg-slate-900/60 ring-1 ring-slate-700 p-2 mt-1"/>
          </div>
          <button onClick={addToCart} className="mt-4 rounded-md bg-emerald-500 px-4 py-2 font-semibold hover:bg-emerald-400">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
