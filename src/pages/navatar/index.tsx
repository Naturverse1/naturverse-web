import { Link } from "react-router-dom";
import "../../styles/navatar.css";

export default function NavatarHub() {
  return (
    <div className="nv-container">
      <nav className="nv-crumbs">
        <Link to="/">Home</Link> <span>/</span> <span>Navatar</span>
      </nav>

      <h1 className="nv-title">Your Navatar</h1>
      <p className="nv-sub">No Navatar yet — pick one below.</p>

      <div className="nv-cards">
        <div className="nv-card">
          <h3>Pick Navatar</h3>
          <p>Choose from our characters.</p>
          <Link to="/navatar/pick" className="nv-link">Open</Link>
        </div>

        <div className="nv-card disabled">
          <h3>Upload</h3>
          <p>Coming next.</p>
          <span className="nv-link" aria-disabled>View</span>
        </div>

        <div className="nv-card disabled">
          <h3>Describe &amp; Generate</h3>
          <p>Coming next.</p>
          <span className="nv-link" aria-disabled>View</span>
        </div>
      </div>
    </div>
  );
}

