import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Checkout() {
  const cart = useCart();
  const [order, setOrder] = useState<any | null>(null);

  const handlePay = () => {
    const o = cart.placeOrder(cart.total);
    setOrder(o);
  };

  if (order) {
    return (
      <div className="page">
        <div className="success">
          <h2>Order confirmed 🎉</h2>
          {order.navatar?.image && (
            <div style={{ margin: '10px 0' }}>
              <small>Navatar used:</small>
              <br />
              <img
                src={order.navatar.image}
                alt="Navatar used"
                style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #fff' }}
              />
            </div>
          )}
          <p>Order #{order.id}</p>
          <p>Total: {order.totalNatur} NATUR</p>
          <Link to="/marketplace/orders">View order history</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Checkout</h1>
      <ul>
        {cart.items.map((line, i) => (
          <li key={i}>
            {line.qty} × {line.name} — {line.price.toFixed(2)} NATUR
            {line.options && (
              <small style={{ marginLeft: 8, opacity: 0.8 }}>
                {Object.entries(line.options)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")}
              </small>
            )}
          </li>
        ))}
      </ul>
      <p>Total: {cart.total.toFixed(2)} NATUR</p>
      <button onClick={handlePay} disabled={cart.items.length === 0}>
        Pay now
      </button>
    </div>
  );
}
