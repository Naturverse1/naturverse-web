import { Link, Outlet } from "react-router-dom";
import "./index.css";

export default function App() {
  return (
    <div className="nv-container">
      <header className="nv-header">
        <h1>Welcome 🌿</h1>
        <nav className="nv-nav">
          <Link to="/">Home</Link>
          <Link to="/worlds">Worlds</Link>
          <Link to="/zones">Zones</Link>
          <Link to="/arcade">Arcade</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/stories">Stories</Link>
          <Link to="/quizzes">Quizzes</Link>
          <Link to="/observations">Observations</Link>
          <Link to="/naturversity">Naturversity</Link>
          <Link to="/tips">Turian Tips</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>
      <main className="nv-main">
        <Outlet />
      </main>
      <footer className="nv-footer">© {new Date().getFullYear()} Naturverse</footer>
    </div>
  );
}

