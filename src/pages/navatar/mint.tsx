import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { loadActiveNavatar } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function MintNavatarPage() {
  const active = loadActiveNavatar();
  return (
    <main className="container page-pad">
      <Breadcrumbs items={[
        { href: "/", label: "Home" },
        { href: "/navatar", label: "Navatar" },
        { href: "/navatar/mint", label: "NFT / Mint" },
      ]} />
      <h1 className="center page-title">NFT / Mint</h1>
      <NavatarTabs />
      <section className="nv-panel" style={{ marginTop: 12, textAlign: "center" }}>
        <p>Coming soon: mint your Navatar on-chain. In the meantime, make merch with your Navatar on the Marketplace.</p>
        <div style={{ display:"flex", justifyContent:"center", marginTop:12 }}>
          <NavatarCard src={active?.src || null} title={active?.name || ""} />
        </div>
      </section>
    </main>
  );
}
