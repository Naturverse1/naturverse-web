import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadPublicNavatars, PublicNavatar } from "../../lib/navatar/publicList";
import { saveActive as saveActiveId } from "../../lib/localNavatar";
import { saveActive as saveActiveNav } from "../../lib/localStorage";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<PublicNavatar[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    loadPublicNavatars().then(setItems);
  }, []);

  function choose(navatar: PublicNavatar) {
    saveActiveId(navatar.id);
    saveActiveNav({
      id: navatar.id,
      name: navatar.name,
      imageDataUrl: navatar.src,
      createdAt: Date.now(),
    });
    nav("/navatar");
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Pick" }]} />
      <h1 className="center">Pick Navatar</h1>
      <NavatarTabs />
      <div className="nav-grid">
        {items.map(it => (
          <button
            key={it.id}
            className="linklike"
            onClick={() => choose(it)}
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

