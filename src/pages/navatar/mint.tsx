import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarImage from "../../components/NavatarImage";
import CharacterCardView from "../../components/CharacterCard";
import { getActiveNavatarWithCard } from "../../lib/navatar";
import { supabase } from "../../lib/supabase-client";
import type { CharacterCard } from "../../lib/types";
import "../../styles/navatar.css";

export default function MintNavatarPage() {
  const [avatar, setAvatar] = useState<any>(null);
  const [card, setCard] = useState<CharacterCard | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { avatar, card } = await getActiveNavatarWithCard(user.id);
      setAvatar(avatar);
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
        <NavatarImage src={avatar?.image_url} alt={avatar?.name} />
        <a className="pill" href="/marketplace">Go to Marketplace</a>
      </div>

      <div style={{ maxWidth: 480, margin: "20px auto 0" }}>
        <CharacterCardView card={card} />
      </div>
    </main>
  );
}

