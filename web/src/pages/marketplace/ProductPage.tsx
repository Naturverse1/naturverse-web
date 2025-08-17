import React from "react";
import { useParams, Link } from "react-router-dom";
import { getProductBySlug } from "../../lib/products";
import { useCart } from "../../context/CartContext";
import { useProfile } from "../../context/ProfileContext";

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug!);
  const { add } = useCart();
  const { profile } = useProfile();

  if (!product) return <p>Not found.</p>;

  const defaults: Record<string, string> = {};
  if (product.variants?.size) defaults.size = product.variants.size[0];
  if (product.variants?.color) defaults.color = product.variants.color[0];
  if (product.variants?.pack) defaults.pack = product.variants.pack[0];

  const [opts, setOpts] = React.useState<Record<string, string>>(defaults);
  const set = (k: string, v: string) => setOpts((prev) => ({ ...prev, [k]: v }));

  const handleAdd = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.priceNatur,
      qty: 1,
      options: opts,
      thumb: product.thumb,
    });
    alert("Added to cart");
  };

  return (
    <div>
      <Link to="/marketplace">← Back to Marketplace</Link>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 20,
          marginTop: 10,
        }}
      >
        <div>
          <div style={{ position: "relative" }}>
            <img src={product.thumb} style={{ width: "100%", borderRadius: 8 }} />
            {(product.family === "merch" || product.family === "printable") && (
              <div
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "20%",
                  width: "60%",
                  height: "60%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Navatar preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      opacity: 0.9,
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      textAlign: "center",
                      background: "rgba(0,0,0,.5)",
                      padding: "6px 10px",
                      borderRadius: 6,
                    }}
                  >
                    Upload your Navatar
                    <br />
                    to preview here
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2>{product.name}</h2>
          <div style={{ opacity: 0.8, marginBottom: 10 }}>
            {product.priceNatur} NATUR
          </div>

          {product.variants?.size && (
            <Field label="Size">
              <Select
                value={opts.size}
                onChange={(e) => set("size", e.target.value)}
                options={product.variants.size}
              />
            </Field>
          )}
          {product.variants?.color && (
            <Field label="Color">
              <Select
                value={opts.color}
                onChange={(e) => set("color", e.target.value)}
                options={product.variants.color}
              />
            </Field>
          )}
          {product.variants?.pack && (
            <Field label="Pack">
              <Select
                value={opts.pack}
                onChange={(e) => set("pack", e.target.value)}
                options={product.variants.pack}
              />
            </Field>
          )}

          <button onClick={handleAdd} style={{ marginTop: 10 }}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ margin: "8px 0" }}>
      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: any;
  options: string[];
}) {
  return (
    <select value={value} onChange={onChange}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
