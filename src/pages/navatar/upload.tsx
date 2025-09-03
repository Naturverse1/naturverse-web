import { Link } from "react-router-dom";
import "@/styles/navatar.css";

export default function UploadNavatar() {
  return (
    <div className="nv-wrap">
      <nav className="nv-crumbs">
        <Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / <span>Upload</span>
      </nav>
      <h1 className="nv-h1">Upload Navatar</h1>

      <form className="nv-card" onSubmit={(e) => e.preventDefault()}>
        <div className="nv-field"><input type="file" className="nv-input" /></div>
        <div className="nv-field"><input className="nv-input" placeholder="Name (optional)" /></div>
        <button className="nv-btn nv-btn-primary">Upload</button>
      </form>
    </div>
  );
}
