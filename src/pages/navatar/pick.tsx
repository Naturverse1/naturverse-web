import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import {
  listMyNavatars,
  navatarImageUrl,
  setActiveNavatarId,
  type NavatarRow,
} from "../../lib/navatar";
import { supabase } from "../../lib/supabase-client";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<NavatarRow[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    listMyNavatars().then(setItems).catch(() => setItems([]));
  }, []);

  async function choose(id: string) {
    await setActiveNavatarId(supabase, id);
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
            key={it.id}
            className="linklike"
            onClick={() => choose(it.id)}
            aria-label={`Pick ${it.name}`}
            style={{ background: "none", border: 0, padding: 0, textAlign: "inherit" }}
          >
            <NavatarCard src={navatarImageUrl(it.image_path)} title={it.name || "Navatar"} />
          </button>
        ))}
      </div>
    </main>
  );
}

