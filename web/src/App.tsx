import { Link, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Welcome 🌿</h1>
      <p>Naturverse is live — explore the zones, worlds, marketplace, and tips.</p>
      <nav style={{ marginTop: 12 }}>
        <div><Link to="/arcade">Arcade</Link></div>
        <div><Link to="/music">Music Zone</Link></div>
        <div><Link to="/tips">Turian Tips</Link></div>
      </nav>
    </div>
  );
}

const Arcade = () => <div style={{ padding: 16 }}><h2>Arcade</h2></div>;
const Music  = () => <div style={{ padding: 16 }}><h2>Music Zone</h2></div>;
const Tips   = () => <div style={{ padding: 16 }}><h2>Turian Tips</h2></div>;
const NotFound = () => (
  <div style={{ padding: 16 }}>
    <h2>404 — Not Found</h2>
    <Link to="/">Go home</Link>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arcade" element={<Arcade />} />
        <Route path="/music" element={<Music />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
