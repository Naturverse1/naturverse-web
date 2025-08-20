import { Link } from "react-router-dom";
import { useStore } from "../../store/Store";

export default function MarketCart(){
  const { state, dispatch } = useStore();
  const total = state.cart.reduce((n,i)=>n+i.qty*i.price,0);
  if (!state.cart.length) return (<p>Cart is empty. <Link to="/marketplace">Browse items</Link></p>);
  return (
    <>
      <ul className="list">
        {state.cart.map(i=>(
          <li key={i.id} className="row">
            <div className="grow">{i.name}</div>
            <input
              type="number" min={1} value={i.qty}
              onChange={e=>dispatch({type:"qty", id:i.id, qty:Number(e.target.value)})}
              style={{width:64}}
            />
            <div style={{width:80, textAlign:"right"}}>${i.price*i.qty}</div>
            <button onClick={()=>dispatch({type:"remove", id:i.id})}>✕</button>
          </li>
        ))}
      </ul>
      <p style={{textAlign:"right"}}><strong>Total: ${total}</strong></p>
      <p style={{textAlign:"right"}}><Link to="/marketplace/checkout" className="pill">Proceed to checkout →</Link></p>
    </>
  );
}
