import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import "../../styles/navatar.css";

export default function NavatarMarketplaceStub() {
  return (
    <main className="container page-pad">
      <Breadcrumbs items={[
        { href: "/", label: "Home" },
        { href: "/navatar", label: "Navatar" },
        { href: "/navatar/marketplace", label: "Marketplace" },
      ]} />
      <h1 className="center page-title">Marketplace (Coming Soon)</h1>
      <NavatarTabs />
      <section className="nav-grid" style={{ marginTop: 12 }}>
        {[1,2,3,4].map((i) => (
          <div key={i} className="nav-card">
            <div className="nav-card__img" />
            <div className="nav-card__cap"><strong>Coming soon</strong></div>
          </div>
        ))}
      </section>
    </main>
  );
}
