import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, saveCart, cartTotalCents, fmtMoney } from "../../lib/marketplace";

export default function CheckoutPage(){
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const items = getCart();
  const total = useMemo(()=>cartTotalCents(items), [items]);

  async function placeOrder(method:"mock"|"natur"){
    const res = await fetch("/.netlify/functions/checkout-mock", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email, items, total_cents: total, method }) });
    const out = await res.json();
    if(res.ok){
      saveCart([]);
      nav(`/marketplace/order/${out.order_id}`);
    }else{
      alert(out.error || "Checkout failed");
    }
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <Link to="/marketplace/cart" className="text-sm opacity-80 hover:underline">← Back to cart</Link>
      <h1 className="text-2xl font-bold mt-4">Checkout</h1>
      <div className="mt-4">
        <label className="font-semibold">Email for order receipt</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@domain.com" className="w-full rounded-md bg-slate-900/60 ring-1 ring-slate-700 p-2 mt-1"/>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <button onClick={()=>placeOrder("mock")} className="rounded-md bg-indigo-500 px-4 py-2 font-semibold hover:bg-indigo-400">Pay (mock)</button>
        <button disabled className="rounded-md bg-slate-700 px-4 py-2 font-semibold opacity-50">Pay with NATUR (soon)</button>
      </div>
      <div className="mt-4">Total: {fmtMoney(total)}</div>
    </div>
  );
}
