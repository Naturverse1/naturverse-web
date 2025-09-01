import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import './site-header.css';
import Img from './Img';
import CartButton from './CartButton';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';
import { useSupabase } from '@/lib/useSupabase';

export default function SiteHeader() {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setStatus(data.session?.user ? 'authenticated' : 'unauthenticated');
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setStatus(session?.user ? 'authenticated' : 'unauthenticated');
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [supabase]);

  const isAuthed = status === 'authenticated' && !!user;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="row">
        <Link to="/" className="brand">
          <Img src="/favicon-32x32.png" width="28" height="28" alt="" />
          <span>The Naturverse</span>
        </Link>
        <div className="searchWrap">
          <SearchBar />
        </div>
        <div className="actions">
          {isAuthed && (
            <button
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="hamburger"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
          <CartButton />
        </div>
      </div>

      {isAuthed && (
        <nav className="desktopNav">
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
      )}

      {isAuthed && (
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      )}
    </header>
  );
}
