import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/NavBreadcrumbs";
import CardImage from "../../components/CardImage";
import Button from "../../components/Button";
import "../../styles/navatar.css";

export default function NavatarIndex() {
  const url = window.sessionStorage.getItem("navatar_url") || "";
  const name = window.sessionStorage.getItem("navatar_name") || "Me";

  return (
    <div className="nv-wrap">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Navatar" }]} />
      <h1 className="nv-h1">Your Navatar</h1>

      <div className="nv-col nv-row" style={{ textAlign: "center" }}>
        <CardImage src={url} alt={name} />
        <h2 className="nv-h1" style={{ fontSize: 28 }}>{name}</h2>

        <div className="nv-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Link to="/navatar/pick"><Button>Pick Navatar</Button></Link>
          <Link to="/navatar/upload"><Button>Upload</Button></Link>
          <Link to="/navatar/generate"><Button>Describe &amp; Generate</Button></Link>
        </div>
      </div>
    </div>
  );
}
