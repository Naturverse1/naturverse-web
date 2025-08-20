import { useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("order");
  return (
    <section>
      <h1>Order placed 🎉</h1>
      <p>Order ID: {id}</p>
    </section>
  );
}