import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar({ email }: { email?: string | null }) {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="nv-wrap">
      <nav className="nv-nav">
        <NavLink to="/" className="brand" end>
          The Naturverse
        </NavLink>
        <NavLink to="/worlds">Worlds</NavLink>
        <NavLink to="/zones">Zones</NavLink>
        <NavLink to="/marketplace">Marketplace</NavLink>
        <NavLink to="/marketplace/cart" className="cart-link">
          Cart{count > 0 ? <span className="cart-badge">{count}</span> : null}
        </NavLink>
        <NavLink to="/marketplace/orders">Orders</NavLink>
        <div className="nv-spacer" />
        {email ? (
          <>
            <NavLink to="/app">App</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <a href="/.netlify/functions/signout">Sign out</a>
          </>
        ) : (
          <NavLink to="/login">Sign in</NavLink>
        )}
      </nav>
    </div>
  );
}
