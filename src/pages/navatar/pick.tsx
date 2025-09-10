import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadNavatarList, saveActiveNavatar, type Navatar } from "../../lib/navatar";
import { useNavigate } from "react-router-dom";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<Navatar[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await loadNavatarList();
      if (alive) setItems(list);
    })();
    return () => { alive = false; };
  }, []);

  function choose(n: Navatar) {
    saveActiveNavatar(n);
    nav("/navatar");
  }

  return (
    <main className="container page-pad">
      <Breadcrumbs items={[
        { href: "/", label: "Home" },
        { href: "/navatar", label: "Navatar" },
        { href: "/navatar/pick", label: "Pick" },
      ]} />
      <h1 className="center page-title">Pick Navatar</h1>
      <NavatarTabs />
      <div className="nav-grid" style={{ marginTop: 12 }}>
        {items.map((n) => (
          <NavatarCard
            key={n.src}
            src={n.src}
            title={n.name}
            selectable
            onClick={() => choose(n)}
          />
        ))}
      </div>
    </main>
  );
}
