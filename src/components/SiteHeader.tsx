import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import './site-header.css';
import Img from './Img';
import AuthButton from './AuthButton';
import CartBadge from './CartBadge';
import { supabase } from '@/lib/supabase-client';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <div className="container">
        <div className="nav-left">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <Img src="/favicon-32x32.png" width="28" height="28" alt="Naturverse" />
            <span>Naturverse</span>
          </Link>
          <nav className="nav nav-links">
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
              to="/wishlist"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              Wishlist
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
            {/* Navatar is always enabled */}
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
          </nav>
        </div>
        <div className="nav-right">
          <AuthButton />
          <CartBadge />
          <button
            className={`nv-menu-btn${open ? ' is-open' : ''}`}
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
