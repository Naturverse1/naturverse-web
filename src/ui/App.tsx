import { NavLink, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="shell">
      <header className="site-header">
        <h1 className="brand">Welcome <span className="sprout">🌿</span></h1>
        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/worlds">Worlds</NavLink>
          <NavLink to="/zones">Zones</NavLink>
          <NavLink to="/arcade">Arcade</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/stories">Stories</NavLink>
          <NavLink to="/quizzes">Quizzes</NavLink>
          <NavLink to="/observations">Observations</NavLink>
          <NavLink to="/naturversity">Naturversity</NavLink>
          <NavLink to="/tips">Turian Tips</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="site-footer">
        © 2025 Naturverse
      </footer>
    </div>
  );
}

