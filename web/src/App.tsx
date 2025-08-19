import { Route, Routes, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Home from './pages/Home';
import Zones from './pages/Zones';
import Worlds from './pages/Worlds';
import Marketplace from './pages/Marketplace';
import Tips from './pages/Tips';
import Arcade from './pages/Arcade';
import Music from './pages/Music';

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
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/zones" element={<Zones />} />
          <Route path="/worlds" element={<Worlds />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/arcade" element={<Arcade />} />
          <Route path="/music" element={<Music />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
