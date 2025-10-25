import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import AuthButton from '@/components/AuthButton';
import CartBadge from '@/components/CartBadge';

export default function Header() {
  const { user } = useAuth();

  // When signed out, hide the entire header/nav.
  if (!user) return null;

  return (
    <header className="nv-header">
      <div className="nv-header__inner">
        <Link to="/" className="nv-brand" aria-label="The Naturverse">
          <span className="nv-brand__logo" />
          <span className="nv-brand__text">The Naturverse</span>
        </Link>

        {/* Existing nav items */}
        <nav className="nv-nav">
          <NavLink to="/worlds">Worlds</NavLink>
          <NavLink to="/zones">Zones</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/naturversity">Naturversity</NavLink>
          <NavLink to="/naturbank">NaturBank</NavLink>
          <NavLink to="/navatar">Navatar</NavLink>
          <NavLink to="/passport">Passport</NavLink>
          <NavLink to="/turian">Turian</NavLink>
        </nav>

        {/* keep your cart/avatar controls */}
        <div className="nv-actions">
          <AuthButton />
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
