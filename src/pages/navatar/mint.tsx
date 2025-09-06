import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadActive } from "../../lib/localStorage";
import { getActiveNavatar, getCardForAvatar } from "../../lib/navatar";
import useAuthUser from "../../lib/useAuthUser";
import "../../styles/navatar.css";

export default function MintNavatarPage() {
  const activeNavatar = useMemo(() => loadActive<any>(), []);
  const { user, ready } = useAuthUser();
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: act } = await getActiveNavatar(user.id);
      if (!act) return;
      const { data: c } = await getCardForAvatar(act.id);
      setCard(c);
    })();
  }, [user]);

  if (!ready) return <div style={{ padding: 16 }}>Loading…</div>;
  if (!user) return <div style={{ padding: 16 }}>Please sign in.</div>;

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "NFT / Mint" }]} />
      <h1 className="center">NFT / Mint</h1>
      <NavatarTabs />
      <p style={{ textAlign: "center", maxWidth: 560, margin: "8px auto 20px" }}>
        Coming soon: mint your Navatar on-chain. In the meantime, make merch with your Navatar on the Marketplace.
      </p>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <NavatarCard src={activeNavatar?.imageDataUrl} title={activeNavatar?.name || "My Navatar"} />
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

