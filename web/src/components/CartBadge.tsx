import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartBadge() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return (
    <Link to="/marketplace/checkout" style={{ position: 'relative' }}>
      🛒
      {count > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -6,
            right: -10,
            fontSize: 12,
            background: '#ff5',
            color: '#000',
            borderRadius: 10,
            padding: '2px 6px',
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
