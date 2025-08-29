import { useEffect, useState } from "react";
import { getRecent } from "@/lib/recent";
import { PRODUCT_IMG } from "@/data/productImages";

export default function RecentCarousel() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => setIds(getRecent().slice().reverse()), []);
  if (!ids.length) return null;

  return (
    <section style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 8 }}>Recently viewed</h3>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(140px,1fr)",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {ids.map((id) => (
          <a key={id} href={`/marketplace/${id}`} className="recent-card">
            <img src={PRODUCT_IMG[id] || "/img/market/placeholder.png"} alt="" />
            <div className="label">{id}</div>
          </a>
        ))}
      </div>
      <style>{`
        .recent-card { display:block; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background:#fff; }
        .recent-card img { width:100%; height:110px; object-fit:cover; display:block; }
        .recent-card .label { padding:8px; font-size:.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      `}</style>
    </section>
  );
}
