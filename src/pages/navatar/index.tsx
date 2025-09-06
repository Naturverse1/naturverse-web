import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import CharacterCard from "../../components/CharacterCard";
import NavatarImage from "../../components/NavatarImage";
import { getActiveNavatarId, navatarImageUrl } from "../../lib/navatar";
import { supabase } from "../../lib/supabase-client";
import { Link } from "react-router-dom";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [active, setActive] = useState<any>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const id = await getActiveNavatarId(supabase);
      if (!alive) return;
      setActiveId(id);
      if (id) {
        const { data } = await supabase
          .from("avatars")
          .select("*")
          .eq("id", id)
          .single();
        if (alive) setActive(data);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!activeId || !active) {
    return (
      <main className="container page-pad">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
        <h1 className="center page-title">My Navatar</h1>
        <NavatarTabs />
        <p className="center">
          No Navatar yet. <Link to="/navatar/pick">Pick Navatar</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="container page-pad">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      <h1 className="center page-title">My Navatar</h1>
      <NavatarTabs />
      <div className="navatar-hub" style={{ marginTop: 8 }}>
        <NavatarImage src={navatarImageUrl(active.image_path) || ""} alt={active.name || "Navatar"} />
        <CharacterCard avatarId={activeId} color="blue" />
      </div>
    </main>
  );
}
