import { useStore } from "../../store/Store";
import { supabase } from "../../lib/supabase";

export default function MarketCheckout(){
  const { state, dispatch } = useStore();
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
        <input placeholder="Full name" />
        <input placeholder="Email" />
        <input placeholder="Address" />
        <input placeholder="City" />
        <input placeholder="Card number" />
        <input placeholder="Expiry / CVC" />
      </div>
      <button onClick={pay}>Pay now</button>
    </>
  );
}
