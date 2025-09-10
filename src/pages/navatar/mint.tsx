import React from "react";
import { loadActive } from "../../lib/navatar";
import { supabase } from "../../lib/supabase-client";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import "../../styles/navatar.css";

export default function MintPage() {
  const [img, setImg] = React.useState<string | undefined>(undefined);
  const [name, setName] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const id = loadActive();
      if (!id) return;
      const { data } = await supabase
        .from("avatars")
        .select("name,image_url")
        .eq("id", id)
        .single();
      if (data) {
        setImg(data.image_url || undefined);
        setName(data.name || "");
      }
    })();
  }, []);

  return (
    <main className="container page-pad">
      <h1 className="center page-title">NFT / Mint</h1>
      <NavatarTabs />
      <section className="nv-panel center" style={{ marginTop: 16 }}>
        <NavatarCard src={img} title={name || "My Navatar"} />
      </section>

      <div className="center" style={{ marginTop: 12 }}>
        <a className="btn" href="/navatar/marketplace">Go to Marketplace</a>
      </div>

      <aside className="nv-panel" style={{ marginTop: 20 }}>
        <h3>Character Card</h3>
        <p>No card yet. <a href="/navatar/card">Create Card</a></p>
      </aside>
    </main>
  );
}

