import { Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <h1>The Naturverse</h1>
      <nav style={{ marginBottom: 12 }}>
        <Link to="/">Home</Link>{" | "}
        <Link to="/zones">Zones</Link>{" | "}
        <Link to="/arcade">Arcade</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div>Welcome 🌿 Naturverse is live.</div>} />
        <Route path="/zones/*" element={<div>Zones</div>} />
        <Route path="/arcade/*" element={<div>Arcade</div>} />
        <Route path="*" element={<div>404 — Not Found</div>} />
      </Routes>
    </div>
  );
}
