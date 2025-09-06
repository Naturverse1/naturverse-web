import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarImage from "../../components/NavatarImage";
import { loadPublicNavatars, PublicNavatar } from "../../lib/navatar/publicList";
import { saveActive } from "../../lib/localStorage";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<PublicNavatar[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    loadPublicNavatars().then(setItems);
  }, []);

  function choose(src: string, name: string) {
    saveActive({ id: Date.now(), name, imageDataUrl: src, createdAt: Date.now() });
    nav("/navatar");
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
            <figure className="nav-card">
              <NavatarImage src={it.src} alt={it.name} maxHeight={260} />
              <figcaption className="nav-card__cap">
                <strong>{it.name}</strong>
              </figcaption>
            </figure>
          </button>
        ))}
      </div>
    </main>
  );
}

