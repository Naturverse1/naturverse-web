import { stripePromise } from "../lib/stripe";

async function handleCheckout() {
  const stripe = await stripePromise;
  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
  });
  const { id } = await res.json();
  stripe?.redirectToCheckout({ sessionId: id });
}

export default function BuyNavatar() {
  return (
    <button onClick={handleCheckout}>Buy Navatar Style Kit – $9.99</button>
  );
}
