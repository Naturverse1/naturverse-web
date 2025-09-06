import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import CharacterCard from "../../components/CharacterCard";
import NavatarImage from "../../components/NavatarImage";
import { getActiveNavatarWithCard, navatarImageUrl } from "../../lib/navatar";
import { supabase } from "../../lib/supabase-client";
import type { CharacterCard as Card } from "../../lib/types";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const [navatar, setNavatar] = useState<any>(null);
  const [card, setCard] = useState<Card | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { navatar, card } = await getActiveNavatarWithCard(supabase, user.id);
      setNavatar(navatar);
      setCard(card);
    })();
  }, []);

  return (
    <main className="container page-pad">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      <h1 className="center page-title">My Navatar</h1>
      <NavatarTabs />
      <div className="navatar-hub" style={{ marginTop: 8 }}>
        <section className="nv-panel">
          <NavatarImage
            src={navatarImageUrl(navatar?.image_path ?? null)}
            alt={navatar?.name ?? "Navatar"}
            mode="contain"
          />
        </section>

        <aside>
          <CharacterCard
            card={card ?? undefined}
            color="blue"
            onEdit={() => navigate("/navatar/card")}
          />
        </aside>
      </div>
    </main>
  );
}
