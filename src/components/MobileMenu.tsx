import { Link } from 'react-router-dom';
import './mobile-menu.css';

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void; }) {
  if (!open) return null;
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="sheet">
        <button className="close" aria-label="Close" onClick={onClose}>×</button>
        <nav className="links">
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/naturversity">Naturversity</Link>
          <Link to="/naturbank">NaturBank</Link>
          <Link to="/navatar">Navatar</Link>
          <Link to="/passport">Passport</Link>
          <Link to="/turian">Turian</Link>
        </nav>
      </div>
      <div className="backdrop" onClick={onClose} />
    </div>
  );
}
