function handleCheckout() {
  alert("Checkout is currently unavailable.");
}

export default function BuyNavatar() {
  return (
    <button onClick={handleCheckout}>Buy Navatar Style Kit – $9.99</button>
  );
}
