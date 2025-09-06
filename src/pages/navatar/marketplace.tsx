import { Link } from "react-router-dom";
import { BlueBreadcrumbs } from "../../components/BlueBreadcrumbs";
import { PageShell } from "../../components/PageShell";
import { NavatarTabs } from "../../components/NavatarTabs";

export default function NavatarMarketplaceStub() {
  return (
    <PageShell>
      <BlueBreadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Navatar", to: "/navatar" },
          { label: "Marketplace", to: "/navatar/marketplace" },
        ]}
      />
      <h1 className="nv-heading">Marketplace</h1>
      <NavatarTabs active="marketplace" />

      <div className="nv-card nv-center" style={{ maxWidth: 720 }}>
        <p className="nv-lead">Mockups for tees, plushies, stickers and more are coming soon.</p>
        <p className="nv-muted">You’ll be able to place your Navatar on products here, then purchase on the Marketplace.</p>
        <Link className="nv-button" to="/marketplace">Go to Marketplace</Link>
      </div>
    </PageShell>
  );
}
