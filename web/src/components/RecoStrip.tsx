import React from "react";
import type { Item } from "../lib/reco";

export default function RecoStrip({ title, items, source }: { title:string; items:Item[]; source:string }) {
  React.useEffect(() => {
    if (items?.length) {
      console.log('reco_view', { source, count: items.length });
    }
  }, [items, source]);

  if (!items?.length) return null;
  return (
    <section className="panel" style={{ padding:"12px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <h3 style={{ margin:0 }}>{title}</h3>
        <a href="/marketplace" className="button alt" style={{ padding:"4px 8px" }}>See all</a>
      </div>
      <div className="reco-row">
        {items.map(it => (
          <a
            key={it.id}
            className="reco-card"
            href={`/marketplace/item?id=${it.id}`}
            aria-label={it.name}
            onClick={() => console.log('reco_click', { id: it.id, source })}
          >
            <img src={it.image} alt="" loading="lazy" />
            <div className="reco-name">{it.name}</div>
            <div className="reco-price">{it.price.toFixed(2)} NATUR</div>
          </a>
        ))}
      </div>
    </section>
  );
}
