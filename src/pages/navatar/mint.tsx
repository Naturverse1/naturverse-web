import { useMemo } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadActive } from "../../lib/localStorage";
import "../../styles/navatar.css";

export default function MintNavatarPage() {
  const activeNavatar = useMemo(() => loadActive<any>(), []);
  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "NFT / Mint" }]} />
      <h1 className="center">NFT / Mint</h1>
      <NavatarTabs active="mint" variant="sub" />
      <p style={{ textAlign: "center", maxWidth: 560, margin: "8px auto 20px" }}>
        Coming soon: mint your Navatar on-chain. In the meantime, make merch with your Navatar on the Marketplace.
      </p>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <NavatarCard src={activeNavatar?.imageDataUrl} title={activeNavatar?.name || "My Navatar"} />
        <a className="pill" href="/marketplace">Go to Marketplace</a>
      </div>
    </main>
  );
}

