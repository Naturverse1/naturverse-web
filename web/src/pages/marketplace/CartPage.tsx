import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const nav = useNavigate();
  const cart = useCart();
  return (
    <div className="page">
      <h1>Cart</h1>
      {cart.items.length === 0 && (
        <>
          <p>Your cart is empty.</p>
          <Link to="/marketplace">Browse products →</Link>
        </>
      )}
      {cart.items.length > 0 && (
        <>
          <table className="cart">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cart.items.map((i) => (
                <tr key={i.id}>
                  <td>
                    {i.thumb && (
                      <img
                        src={i.thumb}
                        alt=""
                        style={{ width: 36, height: 36, marginRight: 8, borderRadius: 6 }}
                      />
                    )}
                    {i.name}
                  </td>
                  <td>
                    <button onClick={() => cart.setQty(i.id, i.qty - 1)}>-</button>
                    <span style={{ margin: '0 8px' }}>{i.qty}</span>
                    <button onClick={() => cart.setQty(i.id, i.qty + 1)}>+</button>
                  </td>
                  <td>{i.price.toFixed(2)} NATUR</td>
                  <td>{(i.price * i.qty).toFixed(2)} NATUR</td>
                  <td>
                    <button onClick={() => cart.remove(i.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="summary">
            <div>
              Subtotal: <b>{cart.subtotal.toFixed(2)} NATUR</b>
            </div>
            <div>
              Fee (5%): <b>{cart.fee.toFixed(2)} NATUR</b>
            </div>
            <div>
              Total: <b>{cart.total.toFixed(2)} NATUR</b>
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => nav('/marketplace/checkout')} disabled={cart.items.length === 0}>
                Checkout →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
