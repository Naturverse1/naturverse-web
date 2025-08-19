import React from "react";

type Item = { id: string; name: string; price: string; note?: string };

const ITEMS: Item[] = [
  { id: "seed-pack", name: "Rainforest Seed Pack", price: "$9.99" },
  { id: "eco-bottle", name: "Eco Water Bottle", price: "$14.00" },
  { id: "field-guide", name: "Pocket Field Guide", price: "$7.50" },
  { id: "poster", name: "Ocean Creatures Poster", price: "$12.00" },
];

export default function Marketplace() {
  return (
    <section>
      <h1>🛒 Marketplace</h1>
      <p>Discover and trade Naturverse items.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginTop: 16 }}>
        {ITEMS.map(i => (
          <div key={i.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{i.name}</div>
            <div>{i.price}</div>
            <button style={{ marginTop: 10 }}>Add to cart</button>
          </div>
        ))}
      </div>
    </section>
  );
}

