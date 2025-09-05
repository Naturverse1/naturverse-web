import Breadcrumbs from "../../components/Breadcrumbs";
import SectionTabs from "../../components/SectionTabs";

export default function MarketplaceHubLayout({ children }: { children?: React.ReactNode }) {
  return (
    <main className="container">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
        ]}
      />
      <h1 style={{ color: "var(--nv-blue-700)" }}>Marketplace</h1>
      <SectionTabs />
      {children}
    </main>
  );
}
