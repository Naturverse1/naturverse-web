import { NavLink } from "react-router-dom";

const link = ({ isActive }: { isActive: boolean }) =>
  ({
    display: "inline-block",
    marginRight: "1rem",
    textDecoration: isActive ? "underline" : "none",
  }) as React.CSSProperties;

export default function Nav() {
  return (
    <nav style={{ marginTop: "0.75rem" }}>
      <NavLink to="/" style={link}>Home</NavLink>
      <NavLink to="/worlds" style={link}>Worlds</NavLink>
      <NavLink to="/zones" style={link}>Zones</NavLink>
      <NavLink to="/arcade" style={link}>Arcade</NavLink>
      <NavLink to="/marketplace" style={link}>Marketplace</NavLink>
      <NavLink to="/stories" style={link}>Stories</NavLink>
      <NavLink to="/quizzes" style={link}>Quizzes</NavLink>
      <NavLink to="/observations" style={link}>Observations</NavLink>
      <NavLink to="/naturversity" style={link}>Naturversity</NavLink>
      <NavLink to="/turian" style={link}>Turian Tips</NavLink>
      <NavLink to="/profile" style={link}>Profile</NavLink>
    </nav>
  );
}

