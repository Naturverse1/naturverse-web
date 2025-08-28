import React from "react";
import { ZONES } from "../../data/zones";
import "../../components/market.css";

export default function ZonesPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 10 }}>Zones Explorer</h1>
      <p style={{ opacity: .8, marginTop: 0 }}>
        Discover the magical regions of the Naturverse.
      </p>

      <div className="market-grid">
        {ZONES.map(z => (
          <article key={z.slug} className="product">
            <a className="product__image" href={`/zones/${z.slug}`} aria-label={`Open ${z.name}`}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
                height: "100%",
                background: "#f2f4f7"
              }}>{z.emoji}</div>
            </a>
            <div className="product__body">
              <h3 className="product__title">
                <a href={`/zones/${z.slug}`}>{z.name}</a>
              </h3>
              <p className="product__meta">
                <span className="product__cat">{z.region}</span>
              </p>
              <p className="product__summary">{z.summary}</p>
              <div className="product__actions">
                <a className="btn ghost" href={`/zones/${z.slug}`}>Explore</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
