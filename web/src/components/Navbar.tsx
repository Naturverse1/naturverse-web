import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  const navatar = (() => {
    try { return localStorage.getItem('navatar_url'); } catch { return null; }
  })();

  return (
    <nav className="nav">
      <a href="/">Home</a>
      <a href="/zones">Zones</a>
      <a href="/marketplace">Marketplace</a>
      <a href="/marketplace/cart">Cart</a>
      <a href="/marketplace/orders">Orders</a>

      <div style={{marginLeft:'auto', display:'flex', gap:'.75rem', alignItems:'center'}}>
        {user ? (
          <>
            <a href="/profile" style={{display:'inline-flex', alignItems:'center', gap:'.5rem'}}>
              {navatar ? (
                <img src={navatar} alt="Navatar" width={28} height={28}
                     style={{borderRadius:'50%', objectFit:'cover'}} />
              ) : (
                <div style={{
                  width:28, height:28, borderRadius:'50%',
                  background:'rgba(255,255,255,.12)', display:'grid', placeItems:'center', fontSize:12
                }}>
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span>Profile</span>
            </a>
            <button onClick={signOut}>Sign out</button>
          </>
        ) : (
          <a href="/#signin">Sign in</a>
        )}
      </div>
    </nav>
  );
}

