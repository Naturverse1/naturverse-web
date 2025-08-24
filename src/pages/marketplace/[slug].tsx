import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { bySlug } from "../../data/products";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const product = bySlug(slug);

  if (!product) return <main><p>Product not found.</p></main>;

  return (
    <main>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: product.name },
        ]}
      />

      <h1 className="text-4xl font-extrabold mb-4">{product.name}</h1>

      <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div style={{ borderRadius: "1rem", border: "1px solid #e5e7eb", padding: "1rem", background: "#fff" }}>
          <div style={{ position: "relative", width: "100%", height: "18rem" }}>
            <img
              src={product.img}
              alt={product.name}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </div>
        </div>

        <div>
          <p className="text-3xl font-semibold mb-2">${product.price.toFixed(2)}</p>
          {product.desc && <p className="text-lg text-gray-700 mb-6">{product.desc}</p>}

          <button className="rounded-xl bg-blue-600 text-white px-6 py-3 font-semibold shadow-sm">
            Add to cart
          </button>
        </div>
      </div>
    </main>
  );
}
