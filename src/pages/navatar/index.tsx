import { Link } from "react-router-dom";
import { getCurrent } from "@/lib/navatar/store";
import "@/styles/navatar.css";

export default function NavatarPage() {
  const data = getCurrent();
  const image_url = data?.photo;
  const display = data?.name || "Me";

  return (
    <div className="nv-wrap">
      <nav className="nv-crumbs">
        <Link to="/">Home</Link> / <span>Navatar</span>
      </nav>
      <h1 className="nv-h1">Your Navatar</h1>

      {image_url && (
        <div className="nv-hero">
          <img src={image_url} alt="Your Navatar" />
        </div>
      )}

      <h2 style={{ textAlign: "center", margin: "4px 0 12px" }}>{display}</h2>

      <div className="nv-actions">
        <Link to="/navatar/pick" className="nv-btn nv-btn-primary">Pick Navatar</Link>
        <Link to="/navatar/upload" className="nv-btn nv-btn-primary">Upload</Link>
        <Link to="/navatar/generate" className="nv-btn nv-btn-primary">Describe &amp; Generate</Link>
      </div>
    </div>
  );
}
