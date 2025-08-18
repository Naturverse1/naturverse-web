import { useEffect, useState } from 'react';
import { getCart } from '../lib/cart';
import { Link, NavLink } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  (isActive ? 'nav-active' : undefined);

export default function Navbar() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(getCart().reduce((s,l)=> s+l.qty, 0));
    update();
    const i = setInterval(update, 1000); // simple polling; replace later with event bus
    return () => clearInterval(i);
  }, []);
  return (
    <nav style={{display:'flex',gap:'16px',alignItems:'center',padding:'12px 16px',background:'rgba(10,16,32,.8)',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
      <NavLink end to="/" className={linkClass}>Home</NavLink>
      <NavLink to="/worlds" className={linkClass}>Worlds</NavLink>
      <NavLink to="/zones" className={linkClass}>Zones</NavLink>
      <NavLink to="/zones/arcade" className={linkClass}>Arcade</NavLink>
      <NavLink to="/marketplace" className={linkClass}>Marketplace</NavLink>
      <NavLink to="/account" className={linkClass}>Account</NavLink>
      <NavLink to="/account/wishlist" className={linkClass}>Wishlist</NavLink>
      <Link to="/marketplace/checkout" className="cart-link">
        Cart {count ? <span className="badge">{count}</span> : null}
      </Link>
    </nav>
  );
}
