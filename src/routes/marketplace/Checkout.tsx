import { useEffect, useState } from "react";
import { useStore } from "../../store/Store";
import { fetchNavatar, type NavatarRecord } from "@/lib/navatar";
import { supabase } from "@/supabaseClient";

export default function MarketCheckout(){
  const { state, dispatch } = useStore();
  const [navatar, setNavatar] = useState<NavatarRecord | null>(null);
  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid) return;
      const r = await fetchNavatar(uid);
      setNavatar(r);
    })();
  }, []);
  const total = state.cart.reduce((n,i)=>n+i.qty*i.price,0);
  const pay = async () => {
    if (supabase && state.cart.length){
      await supabase.from("nv_orders").insert({
        email: "demo@example.com",
        total,
        items: state.cart
      });
    }
    alert("Order placed!");
    dispatch({type:"clear"});
  };
  return (
    <>
      <h3>Checkout</h3>
      <p>Items: {state.cart.reduce((n,i)=>n+i.qty,0)} · Total: <strong>${total}</strong></p>
      <div className="grid2">
        <div>
          <div className="grid2">
            <input placeholder="Full name" />
            <input placeholder="Email" />
            <input placeholder="Address" />
            <input placeholder="City" />
            <input placeholder="Card number" />
            <input placeholder="Expiry / CVC" />
          </div>
          <button onClick={pay}>Pay now</button>
        </div>
        {navatar && (
          <div className="card" style={{ padding:12 }}>
            <div style={{ fontWeight:600, marginBottom:6 }}>My Navatar</div>
            <div dangerouslySetInnerHTML={{ __html: navatar.svg }} />
            <small className="muted">We’ll print this on your plushie/shirt when ordering.</small>
          </div>
        )}
      </div>
    </>
  );
}
