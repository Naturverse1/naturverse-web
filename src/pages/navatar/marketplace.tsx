import Breadcrumbs from "../../components/Breadcrumbs";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import { NavatarTabs } from "../../components/NavatarTabs";
import "../../styles/navatar.css";

export default function NavatarMarketplacePage() {
  return (
    <main className="container">
      <Breadcrumbs
        items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Marketplace" }]}
      />
      <h1 className="center">Marketplace</h1>
      <NavatarTabs active="marketplace" context="subpage" />
      <BackToMyNavatar />
      <div className="center" style={{ maxWidth: 560, margin: "16px auto" }}>
        <p>Mockups for tees, plushies, stickers and more are coming soon.</p>
        <p>You’ll be able to place your Navatar on products here, then purchase on the Marketplace.</p>
        <a className="pill" href="/marketplace">Go to Marketplace</a>
      </div>
    </main>
  );
}

