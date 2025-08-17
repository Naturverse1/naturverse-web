import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { fmtMoney } from "../../lib/marketplace";

type Order = { id:string; total_cents:number };

export default function OrderPage(){
  const { id } = useParams();
  const [order, setOrder] = useState<Order|null>(null);
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{
    (async ()=>{
      const { data: o } = await supabase.from("orders").select("*").eq("id", id!).limit(1);
      setOrder(o?.[0] || null);
      const { data: it } = await supabase.from("order_items").select("*, products(title), product_variants(name)").eq("order_id", id!);
      setItems(it||[]);
    })();
  },[id]);
  if(!order) return <>Loading…</>;
  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-2">Order placed 🎉</h1>
      <p className="mb-4">Order ID: {order.id}</p>
      <p className="mb-4">Total: {fmtMoney(order.total_cents)}</p>
      <h2 className="text-xl font-semibold mb-2">Items</h2>
      <ul className="list-disc pl-6 mb-4">
        {items.map((i,idx)=>(
          <li key={idx}>{i.products?.title} — {i.product_variants?.name} × {i.qty}</li>
        ))}
      </ul>
      <Link to="/marketplace" className="underline">Back to Marketplace</Link>
    </div>
  );
}
