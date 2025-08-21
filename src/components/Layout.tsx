import { Outlet, Link } from "react-router-dom";
import Nav from "./Nav";

export default function Layout() {
  return (
    <div style={{ maxWidth: 980, margin: "2rem auto", padding: "0 1rem" }}>
      <header style={{ marginBottom: "1.25rem" }}>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <h1 style={{ fontSize: "2.25rem", margin: 0 }}>
            Welcome <span role="img" aria-label="leaf">🌿</span>
          </h1>
        </Link>
        <Nav />
      </header>
      <Outlet />
      <footer style={{ opacity: 0.6, marginTop: "3rem", fontSize: ".9rem" }}>
        © {new Date().getFullYear()} Naturverse
      </footer>
    </div>
  );
}

