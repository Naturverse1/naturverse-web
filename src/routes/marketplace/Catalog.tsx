import { Link } from "react-router-dom";
import { PRODUCTS } from "./data";

export default function MarketCatalog(){
  return (
    <ul className="cards">
      {PRODUCTS.map(p=>(
        <li key={p.id} className="card">
          <Link to={`/marketplace/product/${p.id}`} className="card-link">
            <div className="card-emoji">{p.emoji}</div>
            <div>
              <div className="card-title">{p.name}</div>
              <div className="card-sub">${p.price} · {p.desc}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
