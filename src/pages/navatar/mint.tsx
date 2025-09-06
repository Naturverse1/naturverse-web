import { Link } from "react-router-dom";
import { BlueBreadcrumbs } from "../../components/BlueBreadcrumbs";
import { PageShell } from "../../components/PageShell";
import { NavatarTabs } from "../../components/NavatarTabs";

export default function NavatarMintStub() {
  return (
    <PageShell>
      <BlueBreadcrumbs items={[
        { label:"Home", to:"/" },
        { label:"Navatar", to:"/navatar" },
        { label:"NFT / Mint", to:"/navatar/mint" },
      ]}/>
      <h1 className="nv-heading">Mint your Navatar</h1>
      <NavatarTabs active="mint" />
      <div className="nv-card nv-center" style={{ maxWidth: 720 }}>
        <p className="nv-lead">NFT minting is coming soon.</p>
        <p className="nv-muted">In the meantime, you can browse merch in the shop.</p>
        <Link className="nv-button" to="/marketplace">Go to Marketplace</Link>
      </div>
    </PageShell>
  );
}
