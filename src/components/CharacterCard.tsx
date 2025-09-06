import React from "react";
import { Navatar } from "../lib/navatar/types";
import "./../styles/navatar.css";

export default function CharacterCard({ n }: { n: Navatar | null }) {
  if (!n) return (
    <div className="nv-card empty">
      <p>No Navatar yet — pick, upload, or generate one above.</p>
    </div>
  );

  const img = n.imageDataUrl || n.imageUrl;

  return (
    <div className="nv-card">
      <div className="img">
        {img ? <img src={img} alt={n.name || "Navatar"} /> : <div className="ph">No photo</div>}
      </div>
      <div className="meta">
        <div className="name">{n.name || "My Navatar"}</div>
        <div className="sub">
          {n.base || "—"} • {new Date(n.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
