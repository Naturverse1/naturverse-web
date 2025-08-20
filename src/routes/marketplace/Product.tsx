import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "./data";
import { useStore } from "../../store/Store";

export default function MarketProduct(){
  const { id } = useParams();
  const item = PRODUCTS.find(p=>p.id===id);
  const { dispatch } = useStore();
  if (!item) return <p>Product not found.</p>;
  return (
    <>
      <p><Link to="/marketplace">← Back to catalog</Link></p>
      <h3>{item.emoji} {item.name}</h3>
      <p className="muted">{item.desc}</p>
      <p><strong>${item.price}</strong></p>
      <button onClick={()=>dispatch({type:"add", item})}>Add to cart</button>
    </>
  );
}
