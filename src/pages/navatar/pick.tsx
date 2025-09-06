import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { loadPublicNavatars, PublicNavatar } from "../../lib/navatar/publicList";
import { saveActive } from "../../lib/localStorage";

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
      <NavatarTabs active="pick" />
      <div className="grid grid-cards">
        {items.map((it) => (
          <button
            key={it.src}
            className="navatar-card"
            onClick={() => choose(it.src, it.name)}
            aria-label={`Pick ${it.name}`}
          >
            <div className="img">
              <img src={it.src} alt={it.name} />
            </div>
            <p className="center" style={{ fontWeight: 700, marginTop: 8 }}>
              {it.name}
            </p>
          </button>
        ))}
      </div>
      <style>{`.grid-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}`}</style>
    </main>
  );
}

