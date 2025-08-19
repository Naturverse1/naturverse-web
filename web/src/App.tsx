import { Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import { getAutoRoutes } from "./router/autoRoutes";

export default function App() {
  const auto = getAutoRoutes();

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Every file in src/pages/** becomes a route automatically */}
      {auto.map(r => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}

      <Route path="*" element={
        <div style={{ padding: 24 }}>
          <h1>404 — Not Found</h1>
          <p><Link to="/">Go home</Link></p>
        </div>
      } />
    </Routes>
  );
}
