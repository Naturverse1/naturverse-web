import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadPublicNavatars, PublicNavatar } from "../../lib/navatar/publicList";
import { saveNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<PublicNavatar[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    loadPublicNavatars().then(setItems);
  }, []);

  async function choose(src: string, name: string) {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const file = new File([blob], "navatar.png", { type: blob.type });
      const row = await saveNavatar({ name, base_type: "Animal", file });
      setActiveNavatarId(row.id);
      nav("/navatar");
    } catch {
      alert("Could not save Navatar.");
    }
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Pick" }]} />
      <h1 className="center">Pick Navatar</h1>
      <NavatarTabs />
      <div className="nav-grid">
        {items.map((it) => (
          <button
            key={it.src}
            className="linklike"
            onClick={() => choose(it.src, it.name)}
            aria-label={`Pick ${it.name}`}
            style={{ background: "none", border: 0, padding: 0, textAlign: "inherit" }}
          >
            <NavatarCard src={it.src} title={it.name} />
          </button>
        ))}
      </div>
    </main>
  );
}

