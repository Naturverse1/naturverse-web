import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, saveCart, cartTotalCents, fmtMoney } from "../../lib/marketplace";

export default function CartPage(){
  const nav = useNavigate();
  const [items, setItems] = useState(getCart());
  const total = useMemo(()=>cartTotalCents(items), [items]);

  function updateQty(i:number, q:number){
    const nxt=[...items];
    nxt[i].qty=Math.max(1,q);
    setItems(nxt);
    saveCart(nxt);
  }
  function remove(i:number){
    const nxt=[...items];
    nxt.splice(i,1);
    setItems(nxt);
    saveCart(nxt);
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length===0 ? (
        <div>
          Cart is empty. <Link to="/marketplace" className="underline">Continue shopping</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((it,idx)=>(
              <div key={idx} className="flex gap-4 p-3 rounded-lg ring-1 ring-slate-700 bg-slate-900/60">
                <div className="w-32 h-32 flex items-center justify-center bg-slate-800 rounded-md overflow-hidden">
                  {it.navatar_url ? <img src={it.navatar_url} alt="navatar" style={{maxWidth:"100%",maxHeight:"100%"}}/> : <div>No image</div>}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{it.product.title} — {it.variant.name}</div>
                  <div className="text-sm opacity-80">{fmtMoney(it.variant.price_cents)}</div>
                  {it.personalization?.embroidery ? <div className="text-sm opacity-80">Embroidery: {it.personalization.embroidery}</div> : null}
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm">Qty</label>
                    <input type="number" min={1} value={it.qty} onChange={(e)=>updateQty(idx, Math.max(1, Number(e.target.value)||1))} className="w-24 rounded-md bg-slate-900/60 ring-1 ring-slate-700 p-1.5"/>
                  </div>
                  <div className="mt-2">{fmtMoney(it.variant.price_cents * it.qty)}</div>
                  <button onClick={()=>remove(idx)} className="mt-2 text-sm opacity-80 hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/marketplace" className="underline">← Continue shopping</Link>
          </div>
          <div className="mt-4 font-semibold">Subtotal {fmtMoney(total)}</div>
          <button onClick={()=>nav("/marketplace/checkout")} className="mt-3 rounded-md bg-emerald-500 px-4 py-2 font-semibold hover:bg-emerald-400">Checkout</button>
        </>
      )}
    </div>
  );
}
