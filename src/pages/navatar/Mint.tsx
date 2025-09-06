import { Link } from "react-router-dom";

export default function Mint() {
  return (
    <section className="nv-section nv-center">
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>NFT / Mint</span>
      </nav>
      <h2 className="nv-h2">Mint your Navatar as an NFT</h2>
      <p className="nv-muted">Coming soon. In the meantime, make merch with your Navatar.</p>
      <a className="nv-btn-blue" href="/marketplace">Marketplace</a>
    </section>
  );
}
