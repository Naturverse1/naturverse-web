import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import "../../styles/marketplace.css";

export default function MarketplaceNFT() {
  return (
    <main className="container">
      <div className="mk-head">
        <div className="mk-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/marketplace">Marketplace</Link> / <span>NFT / Mint</span>
        </div>
        <h1>Marketplace</h1>
      </div>

      <MarketTabs />
      <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
        NFT / Mint — coming soon.
      </p>
    </main>
  );
}
