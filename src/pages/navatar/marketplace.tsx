import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import "../../styles/navatar.css";

export default function MarketplaceMakerPage() {
  return (
    <main className="container">
      <Breadcrumbs
        items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Marketplace" }]}
      />
      <h1 className="center">Marketplace Maker</h1>
      <NavatarTabs />
      <div className="center" style={{ maxWidth: 560, margin: "16px auto" }}>
        <p>Mock up tees, plushies, stickers and more with your Navatar. (Coming soon.)</p>
        <a className="pill" href="/marketplace">Open Marketplace</a>
      </div>
    </main>
  );
}

