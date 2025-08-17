import { PRODUCTS, Product } from "../../lib/products";
import { Link, useSearchParams } from "react-router-dom";

const families = [
  { key: "all", label: "All" },
  { key: "printable", label: "Printables" },
  { key: "merch", label: "Merch" },
];

export default function MarketplaceHome() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("f") || "all") as "all" | "printable" | "merch";

  const filtered = PRODUCTS.filter((p) =>
    tab === "all" ? true : p.family === tab
  );

  return (
    <div>
      <h1>Marketplace</h1>

      <div style={{ display: "flex", gap: 8, margin: "10px 0 18px" }}>
        {families.map((f) => (
          <button
            key={f.key}
            onClick={() => setParams(f.key === "all" ? {} : { f: f.key })}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,.12)",
              background:
                tab === f.key ? "rgba(255,255,255,.08)" : "transparent",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {filtered.map((p: Product) => (
          <Link
            key={p.id}
            to={`/marketplace/p/${p.slug}`}
            className="card"
          >
            <img src={p.thumb} className="thumb" />
            <div className="meta">
              <div className="name">{p.name}</div>
              <div className="price">{p.priceNatur} NATUR</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
