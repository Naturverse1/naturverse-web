import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
        <strong><Link to="/">Naturverse</Link></strong>
        <nav style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/zones">Zones</Link>
          <Link to="/worlds">Worlds</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/tips">Tips</Link>
          <Link to="/arcade">Arcade</Link>
          <Link to="/music">Music</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
