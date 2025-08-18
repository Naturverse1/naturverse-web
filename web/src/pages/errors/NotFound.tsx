import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="page-container" style={{ textAlign: 'center', padding: '80px 16px' }}>
      <h1>404 — Lost in the Naturverse</h1>
      <p>We couldn't find that page.</p>
      <p style={{ marginTop: 16 }}>
        <Link to="/">Home</Link> ·{' '}
        <Link to="/worlds">Worlds</Link> ·{' '}
        <Link to="/marketplace">Marketplace</Link>
      </p>
    </main>
  );
}
