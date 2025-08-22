import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import './site-header.css';

export default function SiteHeader(){
  const [open, setOpen] = useState(false);
  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <div className="wrap">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/favicon-32x32.png" width="28" height="28" alt="Naturverse" />
          <span>Naturverse</span>
        </Link>
        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen(v => !v)}>
          <span/>
          <span/>
          <span/>
        </button>
        <nav className="nav">
          <NavLink to="/worlds" onClick={() => setOpen(false)}>Worlds</NavLink>
          <NavLink to="/zones" onClick={() => setOpen(false)}>Zones</NavLink>
          <NavLink to="/marketplace" onClick={() => setOpen(false)}>Marketplace</NavLink>
          <NavLink to="/naturversity" onClick={() => setOpen(false)}>Naturversity</NavLink>
          <NavLink to="/naturbank" onClick={() => setOpen(false)}>Naturbank</NavLink>
          <NavLink to="/navatar" onClick={() => setOpen(false)}>Navatar</NavLink>
          <NavLink to="/passport" onClick={() => setOpen(false)}>Passport</NavLink>
          <NavLink to="/turian" onClick={() => setOpen(false)}>Turian</NavLink>
          <NavLink to="/profile" aria-label="Profile" className="icon" onClick={() => setOpen(false)}>👤</NavLink>
          <NavLink to="/cart" aria-label="Cart" className="icon" onClick={() => setOpen(false)}>🛒</NavLink>
        </nav>
      </div>
    </header>
  )
}
