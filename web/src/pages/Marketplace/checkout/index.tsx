import { Link, Outlet, NavLink } from "react-router-dom";

export default function CheckoutLayout() {
  return (
    <section>
      <h1>Checkout</h1>
      <nav style={{margin:"12px 0"}}>
        <NavLink to="shipping">Shipping</NavLink>{" · "}
        <NavLink to="pay">Pay</NavLink>{" · "}
        <NavLink to="review">Review</NavLink>
      </nav>
      <Outlet />
      <div style={{marginTop:12}}>
        <Link to="/marketplace/cart">Back to cart</Link>
      </div>
    </section>
  );
}
