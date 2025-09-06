import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadPublicNavatars, PublicNavatar } from "../../lib/navatar/publicList";
import { saveActiveFromRow } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<PublicNavatar[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    loadPublicNavatars().then(setItems);
  }, []);

  function choose(row: any) {
    saveActiveFromRow({
      id: row.id,
      slug: row.slug,
      name: row.name,
      title: row.title,
      image_url: row.src ?? row.image_url,
    });
    nav("/navatar");
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Pick" }]} />
      <h1 className="center">Pick Navatar</h1>
      <NavatarTabs />
      <div className="nav-grid">
        {items.map((it: any) => (
          <button
            key={it.id ?? it.src}
            className="linklike"
            onClick={() => choose(it)}
            aria-label={`Pick ${it.name ?? it.title}`}
            style={{ background: "none", border: 0, padding: 0, textAlign: "inherit" }}
          >
            <NavatarCard src={it.image_url ?? it.src} title={it.title ?? it.name} />
          </button>
        ))}
      </div>
    </main>
  );
}

