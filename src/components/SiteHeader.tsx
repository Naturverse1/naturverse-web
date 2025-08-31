import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import './site-header.css';
import Img from './Img';
import AuthButton from './AuthButton';
import CartButton from './CartButton';
import SearchBar from './SearchBar';
import { useSupabase } from '@/lib/useSupabase';
import WalletConnect from './WalletConnect';
import ProfileMini from './ProfileMini';

export default function SiteHeader() {
  const supabase = useSupabase();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!supabase) return;
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
  }, [supabase]);

  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <div className="container">
        <div className="nav-left">
            <Link to="/" className="brand" onClick={() => setOpen(false)}>
              <Img src="/favicon-32x32.png" width="28" height="28" alt="" />
              <span>The Naturverse</span>
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
                to="/quests"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={() => setOpen(false)}
              >
                Quests
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
              to="/create/navatar"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              Create Navatar
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
          <div style={{ minWidth: 280 }}>
            <SearchBar />
          </div>
          <AuthButton />
          <ProfileMini />
          <WalletConnect />
          <CartButton />
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
