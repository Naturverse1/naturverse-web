import React from "react";
import ProductCard from "../../components/ProductCard";
import Filters from "../../components/filters/Filters";

export default function Marketplace() {
  // Replace with real data later
  const mock = Array.from({ length: 6 }).map((_, i) => ({
    id: `demo-${i + 1}`,
    title: `Naturverse Item ${i + 1}`,
    price: (i + 1) * 5,
    image: "/assets/og-default.jpg"
  }));

  return (
    <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>🛒 Marketplace</h2>
      <p>Discover and trade Naturverse items.</p>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.5rem" }}>
        <aside><Filters /></aside>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1rem" }}>
          {mock.map(p => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </section>
      </div>
    </main>
  );
}

