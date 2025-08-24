import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { PRODUCTS } from "../../data/products";

export default function Marketplace() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Marketplace" }]} />
      <h1 className="text-4xl font-extrabold mb-4">Marketplace</h1>

      <div style={{ display: "grid", gap: "1.25rem" }}>
        {PRODUCTS.map((p) => (
          <Link key={p.slug} to={`/marketplace/${p.slug}`} style={{ textDecoration: "none" }}>
            <article style={{ borderRadius: "1rem", border: "1px solid #e5e7eb", padding: "1rem", transition: "box-shadow 0.2s" }}>
              <div style={{ borderRadius: "0.75rem", border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: "0.75rem", background: "#fff" }}>
                <div style={{ position: "relative", width: "100%", height: "12rem" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ objectFit: "contain", width: "100%", height: "100%" }}
                    loading="lazy"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-bold">{p.name}</h3>
              <p className="text-lg text-gray-700">${p.price.toFixed(2)}</p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
