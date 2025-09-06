import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarImage from "../../components/NavatarImage";
import CharacterCard from "../../components/CharacterCard";
import { getActiveNavatarId, navatarImageUrl } from "../../lib/navatar";
import { supabase } from "../../lib/supabase-client";
import "../../styles/navatar.css";

export default function MintNavatarPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [active, setActive] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const id = await getActiveNavatarId(supabase);
      setActiveId(id);
      if (id) {
        const { data } = await supabase
          .from("avatars")
          .select("*")
          .eq("id", id)
          .single();
        setActive(data);
      }
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
        {active && (
          <NavatarImage src={navatarImageUrl(active.image_path) || ""} alt={active.name || "Navatar"} />
        )}
        <a className="pill" href="/marketplace">Go to Marketplace</a>
      </div>

      {activeId && active ? (
        <CharacterCard avatarId={activeId} color="blue" />
      ) : (
        <div className="nv-panel" style={{ maxWidth: 480, margin: "20px auto 0" }}>
          <div className="nv-title">Character Card</div>
          <p>No card yet. <Link to="/navatar/card">Create Card</Link></p>
        </div>
      )}
    </main>
  );
}
