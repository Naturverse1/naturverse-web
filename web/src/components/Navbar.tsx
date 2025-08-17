import { NavLink } from 'react-router-dom';

export default function Navbar({ email }: { email?: string | null }) {
  return (
    <div className="nv-wrap">
      <nav className="nv-nav">
        <NavLink to="/" className="brand" end>
          The Naturverse
        </NavLink>
        <NavLink to="/worlds">Worlds</NavLink>
        <NavLink to="/zones">Zones</NavLink>
        <NavLink to="/marketplace">Marketplace</NavLink>
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
