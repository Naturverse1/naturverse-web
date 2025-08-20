import { NavLink, Outlet } from "react-router-dom";
import NavatarChip from "@/components/NavatarChip";

export default function Root() {
  return (
    <div className="wrap">
      <header className="site-header">
        <h1 className="title">Welcome <span className="leaf">🌿</span></h1>
        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/worlds">Worlds</NavLink>
          <NavLink to="/zones">Zones</NavLink>
          <NavLink to="/naturbank">NaturBank</NavLink>
          <NavLink to="/arcade">Arcade</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/navatar">Navatar</NavLink>
          <NavLink to="/stories">Stories</NavLink>
          <NavLink to="/quizzes">Quizzes</NavLink>
          <NavLink to="/observations">Observations</NavLink>
          <NavLink to="/naturversity">Naturversity</NavLink>
          <NavLink to="/tips">Turian Tips</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <NavatarChip />
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="site-footer">© 2025 Naturverse</footer>
    </div>
  );
}

