import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarImage from "../../components/NavatarImage";
import CharacterCard from "../../components/CharacterCard";
import { getActiveNavatarWithCard, navatarImageUrl } from "../../lib/navatar";
import { supabase } from "../../lib/supabase-client";
import "../../styles/navatar.css";

export default function MintNavatarPage() {
  const [navatar, setNavatar] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
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
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "NFT / Mint" }]} />
      <h1 className="center">NFT / Mint</h1>
      <NavatarTabs />
      <p style={{ textAlign: "center", maxWidth: 560, margin: "8px auto 20px" }}>
        Coming soon: mint your Navatar on-chain. In the meantime, make merch with your Navatar on the Marketplace.
      </p>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <NavatarImage
          src={navatarImageUrl(navatar?.image_path ?? null)}
          alt={navatar?.name ?? "Navatar"}
          mode="contain"
        />
        <a className="pill" href="/marketplace">Go to Marketplace</a>
      </div>

      <div style={{ maxWidth: 480, margin: "20px auto 0" }}>
        <CharacterCard
          card={card ?? undefined}
          color="blue"
          onEdit={() => navigate("/navatar/card")}
        />
      </div>
    </main>
  );
}

