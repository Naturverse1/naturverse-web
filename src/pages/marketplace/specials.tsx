import { Link } from "react-router-dom";
import MarketTabs from "../../components/MarketTabs";
import "../../styles/marketplace.css";

export default function MarketplaceSpecials() {
  return (
    <main className="container">
      <div className="mk-head">
        <div className="mk-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/marketplace">Marketplace</Link> / <span>Specials</span>
        </div>
        <h1>Marketplace</h1>
      </div>

      <MarketTabs />
      <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
        Specials — coming soon. Seasonal or limited-time offers will appear here.
      </p>
    </main>
  );
}
