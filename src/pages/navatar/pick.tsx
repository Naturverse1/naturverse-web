import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { loadCatalog } from "../../lib/navatar/catalog";
import { saveActive } from "../../lib/navatar/storage";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const navigate = useNavigate();
  const [items, setItems] = React.useState<{src:string,title?:string}[]>([]);
  React.useEffect(() => { loadCatalog().then(setItems); }, []);

  function pick(src: string) {
    saveActive({ id: crypto.randomUUID(), imageUrl: src, createdAt: Date.now(), base: "—" });
    navigate("/navatar");
  }

  return (
    <main className="nv-wrap">
      <h1 className="nv-title">Pick Navatar</h1>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label:"Navatar" }, { label:"Pick" }]} />
      <NavatarTabs />

      <section className="nv-grid">
        {items.length === 0 && <p className="muted">Add <code>public/navatars/index.json</code> listing image filenames to populate this grid.</p>}
        {items.map((it,i) => (
          <button key={i} className="nv-pick" onClick={() => pick(it.src)}>
            <img src={it.src} alt={it.title || "Navatar"} />
          </button>
        ))}
      </section>
    </main>
  );
}
