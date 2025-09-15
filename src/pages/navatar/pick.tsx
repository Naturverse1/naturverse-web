import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import { listNavatars, pickNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useAuthUser } from "../../lib/useAuthUser";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<{ name: string; url: string; path: string }[]>([]);
  const nav = useNavigate();
  const { user } = useAuthUser();

  useEffect(() => {
    listNavatars().then(setItems).catch(() => setItems([]));
  }, []);

  async function choose(item: { path: string; name: string }) {
    if (!user) {
      alert("Please sign in.");
      return;
    }
    try {
      const row = await pickNavatar(item.path, item.name);
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
      <div className="nav-grid">
        {items.map(it => (
          <button
            key={it.path}
            className="linklike"
            onClick={() => choose(it)}
            aria-label={`Pick ${it.name}`}
            style={{ background: "none", border: 0, padding: 0, textAlign: "inherit" }}
          >
            <NavatarCard src={it.url} title={it.name} />
          </button>
        ))}
      </div>
    </main>
  );
}

