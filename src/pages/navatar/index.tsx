import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import "../../styles/navatar.css";

export default function NavatarHub() {
  const { pathname } = useLocation();
  const onHub = pathname === "/navatar";

  return (
    <main className="nv-wrap">
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <span>Navatar</span>
      </nav>

      <header className="nv-header nv-center">
        <h1 className="nv-title">My Navatar</h1>
        <div className="nv-pill-row" role="tablist" aria-label="Navatar">
          <NavLink to="/navatar" end className="nv-pill">My Navatar</NavLink>
          <NavLink to="/navatar/pick" className="nv-pill">Pick</NavLink>
          <NavLink to="/navatar/upload" className="nv-pill">Upload</NavLink>
          <NavLink to="/navatar/generate" className="nv-pill">Generate</NavLink>
          <NavLink to="/navatar/mint" className="nv-pill">NFT / Mint</NavLink>
          <a className="nv-pill" href="/marketplace">Marketplace</a>
        </div>
      </header>

      <section className="nv-center">
        {onHub ? <Outlet context={{ hub: true }} /> : null}
      </section>

      {!onHub && <section className="nv-center"><Outlet /></section>}
    </main>
  );
}
