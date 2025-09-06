import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";

export default function MintNavatarPage() {
  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "NFT / Mint" }]} />
      <h1 className="center">Mint your Navatar</h1>
      <NavatarTabs active="mint" />
      <div className="center" style={{ maxWidth: 520, margin: "16px auto" }}>
        <p>Minting is coming soon. In the meantime, you can make merch with your Navatar.</p>
        <a className="pill pill--active" href="/navatar/marketplace">Go to Marketplace Maker</a>
      </div>
    </main>
  );
}

