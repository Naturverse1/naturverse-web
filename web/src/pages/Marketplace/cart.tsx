import { useEffect, useState } from "react";
import { readCart, removeFromCart, clearCart, cartTotal } from "../../lib/cart";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cart,setCart]=useState(readCart());
  useEffect(()=>{ setCart(readCart()); },[]);
  const remove = (id:string)=>{ removeFromCart(id); setCart(readCart()); };
  const total = cartTotal(cart);
  return (
    <section>
      <h1>Cart</h1>
      {cart.length===0 ? <p>Your cart is empty.</p> :
        <>
          <ul>{cart.map(c=> <li key={c.product_id}>
            {c.title} × {c.qty} — {c.price_tokens*c.qty} NATUR
            <button onClick={()=>remove(c.product_id)} style={{marginLeft:8}}>Remove</button>
          </li>)}</ul>
          <p><strong>Total: {total} NATUR</strong></p>
          <p>
            <Link to="/marketplace/checkout">Proceed to Checkout</Link> ·{" "}
            <button onClick={()=>{ clearCart(); setCart([]); }}>Clear</button>
          </p>
        </>
      }
    </section>
  );
}

