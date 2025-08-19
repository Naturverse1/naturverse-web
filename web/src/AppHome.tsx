import React from "react";
import { Link } from "react-router-dom";

const linkStyle: React.CSSProperties = { display: "block", padding: "6px 0" };

export default function AppHome() {
  return (
    <div style={{ padding: "2rem", maxWidth: 720 }}>
      <h1>The Naturverse</h1>
      <p>Welcome 🌿 Naturverse is live and the client router is working.</p>
      <h3>Explore</h3>
      <nav>
        <Link to="/zones" style={linkStyle}>Zones</Link>
        <Link to="/marketplace" style={linkStyle}>Marketplace</Link>
        <Link to="/arcade" style={linkStyle}>Arcade</Link>
        <Link to="/naturversity" style={linkStyle}>Naturversity</Link>
        <Link to="/rainforest" style={linkStyle}>Rainforest</Link>
        <Link to="/oceanworld" style={linkStyle}>Ocean World</Link>
        <Link to="/desertworld" style={linkStyle}>Desert World</Link>
        <Link to="/world-hub" style={linkStyle}>World Hub</Link>
        <Link to="/stories" style={linkStyle}>Stories</Link>
        <Link to="/quizzes" style={linkStyle}>Quizzes</Link>
        <Link to="/observations" style={linkStyle}>Observations</Link>
        <Link to="/map" style={linkStyle}>Map Hub</Link>
        <Link to="/profile" style={linkStyle}>Profile</Link>
        <Link to="/settings" style={linkStyle}>Settings</Link>
      </nav>
    </div>
  );
}
