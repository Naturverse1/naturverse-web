import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../state/cart';

export default function Cart() {
  const { items, remove, totalNatur, placeOrder } = useCart();
  const nav = useNavigate();

  const place = () => {
    if (!items.length) return;
    const order = placeOrder();
    nav(`/marketplace/orders?id=${order.id}`);
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {!items.length && (
        <p>
          Cart is empty. <Link to="/marketplace">Shop →</Link>
        </p>
      )}
      {items.map((i) => (
        <div key={i.id} className="row">
          <img src={i.customization.navatarUrl} alt="" className="thumb" />
          <div className="meta">
            <div>{i.title}</div>
            <div className="sub">
              {i.customization.size} {i.customization.color} {i.customization.material} ×{' '}
              {i.customization.qty}
            </div>
          </div>
          <div className="price">{i.lineNatur} NATUR</div>
          <button onClick={() => remove(i.id)}>Remove</button>
        </div>
      ))}
      {items.length > 0 && (
        <>
          <div className="total">
            Total: <strong>{totalNatur} NATUR</strong>
          </div>
          <button onClick={place}>Place order</button>
          <div className="hint">
            Web3 pay coming next. For now, orders save locally for tracking.
          </div>
        </>
      )}
    </div>
  );
}
