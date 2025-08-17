import { Link } from "react-router-dom";

const items = [
  { sku: "plush-turian", name: "Turian Plush", priceNatur: 50 },
  { sku: "halloween-costume", name: "Turian Costume", priceNatur: 100 },
  { sku: "poster", name: "Adventure Poster", priceNatur: 10 },
];

export default function Marketplace() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
      <h1>Marketplace</h1>
      <p>Create magical goods with your Navatar. Pay with NATUR or cash (cash coming soon).</p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
        {items.map(it => (
          <li key={it.sku} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "1rem" }}>
            <h3 style={{ margin: "0 0 .25rem" }}>{it.name}</h3>
            <div style={{ opacity: .8, marginBottom: ".5rem" }}>Price: {it.priceNatur} NATUR</div>
            <Link
              to={`/marketplace/checkout?sku=${encodeURIComponent(it.sku)}&name=${encodeURIComponent(it.name)}&price=${it.priceNatur}`}
              style={{ textDecoration: "underline" }}
            >
              Customize &amp; Buy
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

