import { Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <main style={{ padding: 16 }}>
      <h1>Welcome 🌿</h1>
      <p>Naturverse is live — explore the zones, worlds, marketplace, and tips.</p>

      {/* Use <Link> to avoid full page reloads */}
      <nav style={{ display: "grid", gap: 8, marginTop: 12 }}>
        <Link to="/arcade">Arcade</Link>
        <Link to="/music">Music Zone</Link>
        <Link to="/tips">Turian Tips</Link>
      </nav>
    </main>
  );
}

function Arcade() { return <div style={{ padding:16 }}>🎮 Arcade</div>; }
function Music()  { return <div style={{ padding:16 }}>🎵 Music Zone</div>; }
function Tips()   { return <div style={{ padding:16 }}>🌱 Turian Tips</div>; }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/arcade" element={<Arcade />} />
      <Route path="/music"  element={<Music />} />
      <Route path="/tips"   element={<Tips />} />
      {/* catch-all -> Home (or a NotFound if you prefer) */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

