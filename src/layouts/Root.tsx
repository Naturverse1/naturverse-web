import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav';

export default function Root() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <header>
        <h1>Welcome 🌿</h1>
        <Nav />
      </header>

      <main>
        <Outlet />
      </main>

      <footer style={{ marginTop: '4rem', opacity: 0.7 }}>
        © {new Date().getFullYear()} Naturverse
      </footer>
    </div>
  );
}
