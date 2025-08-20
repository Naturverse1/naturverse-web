import { Link } from "react-router-dom";

export default function Success() {
  return (
    <section>
      <h1>Success 🎉</h1>
      <p>Thank you! Your order has been placed.</p>
      <Link to="/marketplace/orders">View orders</Link>
    </section>
  );
}
