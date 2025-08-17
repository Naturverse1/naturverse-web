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
                    <div style={{ display: 'inline-block', marginRight: 8 }}>
                      <img
                        src={i.previewUrl || i.thumb}
                        alt=""
                        className="preview-thumb"
                      />
                    </div>
                    {i.name}
                    {i.options && (
                      <div style={{ fontSize: 12, opacity: 0.85 }}>
                        {Object.entries(i.options).map(([k, v]) => (
                          <span key={k} style={{ marginRight: 8 }}>
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
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
