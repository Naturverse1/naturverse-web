import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import { NavatarTabs } from "../../components/NavatarTabs";
import { getCardForAvatar, navatarImageUrl } from "../../lib/navatar";
import { getActiveNavatarId } from "../../lib/localNavatar";
import { supabase } from "../../lib/supabase-client";
import "../../styles/navatar.css";

export default function MintNavatarPage() {
  const [navatar, setNavatar] = useState<any | null>(null);
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    const activeId = getActiveNavatarId();
    if (!activeId) return;

    (async () => {
      const { data } = await supabase
        .from("avatars")
        .select("id,name,image_path")
        .eq("id", activeId)
        .maybeSingle();
      setNavatar(data);
      const c = await getCardForAvatar(activeId);
      setCard(c);
    })();
  }, []);

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "NFT / Mint" }]} />
      <h1 className="center">NFT / Mint</h1>
      <NavatarTabs active="mint" context="subpage" />
      <BackToMyNavatar />
      <p style={{ textAlign: "center", maxWidth: 560, margin: "8px auto 20px" }}>
        Coming soon: mint your Navatar on-chain. In the meantime, make merch with your Navatar on the Marketplace.
      </p>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <NavatarCard src={navatarImageUrl(navatar?.image_path)} title={navatar?.name || "My Navatar"} />
        <a className="pill" href="/marketplace">Go to Marketplace</a>
      </div>

      {card ? (
        <aside className="nv-panel" style={{ maxWidth: 480, margin: "20px auto 0" }}>
          <div className="nv-title">Character Card</div>
          <dl className="nv-list">
            <dt>Name</dt><dd>{card.name}</dd>
            <dt>Species</dt><dd>{card.species}</dd>
            <dt>Kingdom</dt><dd>{card.kingdom}</dd>
            <dt>Backstory</dt><dd>{card.backstory || "—"}</dd>
            <dt>Powers</dt><dd>{card.powers?.map((p: string) => `— ${p}`).join("\n") || "—"}</dd>
            <dt>Traits</dt><dd>{card.traits?.map((t: string) => `— ${t}`).join("\n") || "—"}</dd>
          </dl>
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <Link to="/navatar/card" className="btn">Edit Card</Link>
          </div>
        </aside>
      ) : (
        <div className="nv-panel" style={{ maxWidth: 480, margin: "20px auto 0" }}>
          <div className="nv-title">Character Card</div>
          <p>No card yet. <Link to="/navatar/card">Create Card</Link></p>
        </div>
      )}
    </main>
  );
}

