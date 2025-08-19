import { NavLink } from "react-router-dom";

const linkStyle: React.CSSProperties = {
  marginRight: "1rem",
  textDecoration: "none",
};

export default function Nav() {
  return (
    <header style={{ borderBottom: "1px solid #eee" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "1rem 1.5rem" }}>
        <h1 style={{ margin: 0 }}>The Naturverse</h1>
        <nav style={{ marginTop: ".5rem" }}>
          <NavLink to="/" style={linkStyle}>Home</NavLink>
          <NavLink to="/health" style={linkStyle}>Health</NavLink>
          <NavLink to="/worlds" style={linkStyle}>Worlds</NavLink>
          <NavLink to="/marketplace" style={linkStyle}>Marketplace</NavLink>
          <NavLink to="/naturversity" style={linkStyle}>Naturversity</NavLink>
          <NavLink to="/zones" style={linkStyle}>Zones</NavLink>
        </nav>
      </div>
    </header>
  );
}
