import React from "react";
import { PRODUCTS } from "../../data/products";
import ProductCard from "../../components/ProductCard";
import "../../components/market.css";
import { getWishlist } from "../../utils/wishlist";

const CATS = ["All", "Digital", "Physical", "Experience"] as const;

export default function Marketplace() {
  const [q, setQ] = React.useState<string>(() => new URLSearchParams(location.search).get("q") || "");
  const [cat, setCat] = React.useState<typeof CATS[number]>("All");
  const [wished, setWished] = React.useState<string[]>(() => getWishlist());

  React.useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    const next = `${location.pathname}?${sp.toString()}`;
    history.replaceState(null, "", next);
  }, [q]);

  const list = PRODUCTS.filter(p => {
    const passQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.summary.toLowerCase().includes(q.toLowerCase());
    const passC = cat === "All" || p.category === cat;
    return passQ && passC;
  });

  return (
    <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 10 }}>Marketplace</h1>
      <p style={{ opacity: .8, marginTop: 0 }}>Goodies for your journey — digital packs, physical tools, and sessions.</p>

      <div className="market-toolbar" role="search">
        <input
          type="search"
          placeholder="Search marketplace…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search marketplace"
        />
        <div className="tabs" role="tablist" aria-label="Categories">
          {CATS.map(c => (
            <button
              key={c}
              role="tab"
              aria-selected={c === cat}
              className={`tab ${c === cat ? "is-active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <a className="btn ghost" href="/wishlist" aria-label="Open wishlist">
          Wishlist <span className="badge">{wished.length}</span>
        </a>
      </div>

      <div className="market-grid">
        {list.map(p => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            slug={p.slug}
            summary={p.summary}
            image={p.image}
            price={p.price}
            category={p.category}
            onChange={() => setWished(getWishlist())}
          />
        ))}
      </div>
    </main>
  );
}
