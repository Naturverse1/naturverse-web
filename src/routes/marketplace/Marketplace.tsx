import { Link, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../../store/Store";
import NaturToken from "../../components/NaturToken";

export default function Marketplace(){
  const { state } = useStore();
  const count = state.cart.reduce((n,i)=>n+i.qty,0);
  const { pathname } = useLocation();
  const index = pathname.endsWith("/marketplace") || pathname === "/marketplace";
  return (
    <>
      <h2>Marketplace</h2>
      <div className="pillbar">
        <Link className="pill" to="/marketplace">Catalog</Link>
        <Link className="pill" to="/marketplace/cart">Cart ({count})</Link>
        <Link className="pill" to="/marketplace/checkout">Checkout</Link>
      </div>
      <NaturToken />
      {index ? <Outlet /> : <Outlet />}
    </>
  );
}
