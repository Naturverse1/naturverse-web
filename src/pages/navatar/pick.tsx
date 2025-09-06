import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { setActive } from "../../lib/navatar/storage";
import { useNavigate } from "react-router-dom";

type PublicNavatar = { name: string; image: string };

export default function NavatarPick() {
  const [items, setItems] = useState<PublicNavatar[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    // served by your repo’s public tree: public/navatars/manifest.json
    fetch("/navatars/manifest.json")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  function choose(it: PublicNavatar) {
    setActive({
      id: crypto.randomUUID(),
      name: it.name,
      imageUrl: it.image,
      createdAt: Date.now(),
    });
    nav("/navatar"); // back to hub
  }

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/navatar", label: "Navatar" },
          { label: "Pick" },
        ]}
      />
      <h1 className="center">Pick Navatar</h1>
      <NavatarTabs />

      <ul className="grid">
        {items.map((it) => (
          <li
            key={it.image}
            className="card"
            onClick={() => choose(it)}
            role="button"
            tabIndex={0}
          >
            <img src={it.image} alt={it.name} />
            <div className="name">{it.name}</div>
          </li>
        ))}
      </ul>

      <style>{`
        .center{text-align:center}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;padding:0}
        .card{list-style:none;border:1px solid #e3e8ff;border-radius:14px;padding:10px;background:#fff;cursor:pointer}
        .card img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:10px;background:#f3f6ff;display:block}
        .name{margin-top:8px;font-weight:700;color:#1f4bff;text-align:center}
      `}</style>
    </div>
  );
}
