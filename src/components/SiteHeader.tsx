import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import './site-header.css';
import Img from './Img';
import AuthButton from './AuthButton';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <div className="wrap">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <Img src="/favicon-32x32.png" width="28" height="28" alt="Naturverse" />
          <span>Naturverse</span>
        </Link>
        <nav className="nav">
          <NavLink
            to="/worlds"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setOpen(false)}
          >
            Worlds
          </NavLink>
          <NavLink
            to="/zones"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setOpen(false)}
          >
            Zones
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setOpen(false)}
          >
            Marketplace
          </NavLink>
          <NavLink
            to="/naturversity"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setOpen(false)}
          >
            Naturversity
          </NavLink>
          <NavLink
            to="/naturbank"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setOpen(false)}
          >
            NaturBank
          </NavLink>
          <NavLink
            to="/navatar"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setOpen(false)}
          >
            Navatar
          </NavLink>
          <NavLink
            to="/passport"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setOpen(false)}
          >
            Passport
          </NavLink>
          <NavLink
            to="/turian"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            onClick={() => setOpen(false)}
          >
            Turian
          </NavLink>
          <NavLink
            to="/cart"
            aria-label="Cart"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link') + ' icon'}
            onClick={() => setOpen(false)}
          >
            🛒
          </NavLink>
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <AuthButton />
          <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
