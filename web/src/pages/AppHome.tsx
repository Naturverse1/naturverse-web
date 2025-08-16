import { Link } from 'react-router-dom';

export default function AppHome() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Naturverse App — You’re signed in.</h1>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to="/map">Map</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </main>
  );
}
