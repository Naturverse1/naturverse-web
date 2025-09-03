import Breadcrumbs from "../../components/NavBreadcrumbs";
import CardImage from "../../components/CardImage";
import "../../styles/navatar.css";
import CANONS from "../../data/navatarCanons";

export default function NavatarPick() {
  return (
    <div className="nv-wrap">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/navatar", label: "Navatar" }, { label: "Pick" }]} />
      <h1 className="nv-h1">Pick Navatar</h1>

      <div className="nv-row" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {CANONS.map((s, i) => (
          <button key={i} className="nv-btn" style={{ padding: 0 }}>
            <CardImage src={s.url} alt={`Seed ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
