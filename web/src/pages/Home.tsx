import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Welcome 🌿</h1>
      <p>Naturverse is live — explore the zones, worlds, marketplace, and tips.</p>
      <nav style={{ marginTop: 12, lineHeight: 1.8 }}>
        <div><Link to="/zones">Zones</Link></div>
        <div><Link to="/worlds">Worlds</Link></div>
        <div><Link to="/marketplace">Marketplace</Link></div>
        <div><Link to="/tips">Turian Tips</Link></div>
        <div><Link to="/arcade">Arcade</Link></div>
        <div><Link to="/music">Music Zone</Link></div>
      </nav>
    </div>
  );
}
