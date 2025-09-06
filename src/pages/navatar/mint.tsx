import React from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import "../../styles/navatar.css";

export default function MintNavatarPage() {
  return (
    <main className="nv-wrap">
      <h1 className="nv-title">Mint your Navatar as an NFT</h1>
      <Breadcrumbs items={[{ href: "/", label:"Home" }, { href: "/navatar", label:"Navatar" }, { label:"NFT / Mint" }]} />
      <NavatarTabs />
      <section className="nv-pane">
        <p>Coming soon. In the meantime, make merch with your Navatar.</p>
        <Link className="btn" to="/marketplace">Marketplace</Link>
      </section>
    </main>
  );
}
