import Breadcrumbs from "../../components/Breadcrumbs";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import "../../styles/navatar.css";

export default function NavatarMarketplacePage() {
  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs
          items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Marketplace" }]}
        />
      </div>
      <h1 className="pageTitle mt-6 mb-12">Marketplace</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />
      <div className="center" style={{ maxWidth: 560, margin: "16px auto" }}>
        <p>Mockups for tees, plushies, stickers and more are coming soon.</p>
        <p>You’ll be able to place your Navatar on products here, then purchase on the Marketplace.</p>
        <a className="pill" href="/marketplace">Go to Marketplace</a>
      </div>
    </main>
  );
}

