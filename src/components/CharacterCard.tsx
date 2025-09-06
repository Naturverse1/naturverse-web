import type { Navatar } from "../lib/navatar/types";
import "./characterCard.css";

export default function CharacterCard({navatar}:{navatar: Navatar | null}) {
  return (
    <div className="card">
      <div className="card-img">
        {navatar?.imageDataUrl
          ? <img src={navatar.imageDataUrl} alt={navatar.name || "My Navatar"} />
          : <div className="empty">No photo</div>}
      </div>
      <div className="card-meta">
        <div className="name">{navatar?.name || "My Navatar"}</div>
        <div className="date">{navatar ? new Date(navatar.createdAt).toLocaleDateString() : ""}</div>
      </div>
    </div>
  );
}
