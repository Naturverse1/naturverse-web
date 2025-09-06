import React from "react";
import { useAuth } from "../../lib/auth-context";
import { useSupabase } from "../../lib/useSupabase";
import { fetchMyNavatar } from "../../lib/navatar/myNavatar";
import type { Navatar } from "../../lib/navatar/types";
import { setCurrent } from "../../lib/navatar/store";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";

export default function NavatarHub() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [me, setMe] = React.useState<Navatar | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const n = await fetchMyNavatar(user?.id, supabase);
      setMe(n);
      setLoading(false);
    })();
  }, [user?.id, supabase]);

  function makeActive() {
    if (me) { setCurrent(me); alert("Set as your active Navatar ✓"); }
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
      <Breadcrumbs className="breadcrumbs--blue" items={[
        { label: "Home", href: "/" },
        { label: "Navatar", href: "/navatar" },
        { label: "My Navatar" },
      ]}/>
      <h1>My Navatar</h1>
      <NavatarTabs />

      {loading ? (
        <p>Loading…</p>
      ) : me ? (
        <section style={{ display:"flex", gap:24, alignItems:"center" }}>
          <img src={me.img || ""} alt={me.name} width={240} height={240} style={{ borderRadius:12, border:"1px solid #e5e7eb" }}/>
          <div>
            <h2 style={{ margin:0 }}>{me.name}</h2>
            <p style={{ opacity:0.8 }}>{me.base || "Spirit"} • {me.rarity || "Common"}</p>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button className="btn" onClick={makeActive}>Set Active</button>
              <a className="btn btn-outline" href="/navatar/mint">NFT / Mint</a>
              <a className="btn btn-primary" href="/marketplace">Make Merch</a>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <p>You don’t have a saved Navatar yet.</p>
          <div style={{ display:"flex", gap:8 }}>
            <a className="btn btn-primary" href="/navatar/generate">Generate one</a>
            <a className="btn" href="/navatar/upload">Upload yours</a>
            <a className="btn" href="/navatar/pick">Pick from gallery</a>
          </div>
        </section>
      )}
    </main>
  );
}
