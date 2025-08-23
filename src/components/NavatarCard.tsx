import React from "react";
import type { Navatar } from "../types/navatar";
import Img from "./Img";

type Props = { navatar: Navatar };

export default function NavatarCard({ navatar }: Props) {
  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title">
          <span role="img" aria-label="leaf">🌿</span> {navatar.name || navatar.species}
        </div>
        <div className="card__meta">
          {navatar.base} • {new Date(navatar.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="card__media">
        {navatar.imageDataUrl ? (
          <Img src={navatar.imageDataUrl} alt={`${navatar.name || navatar.species}`} />
        ) : (
          <div className="card__placeholder" aria-label="No photo">No photo</div>
        )}
      </div>

      <div className="card__section">
        <strong>Species:</strong> {navatar.species}
      </div>
      <div className="card__section">
        <strong>Powers:</strong> {navatar.powers.join(" · ")}
      </div>
      <div className="card__section">
        <strong>Backstory:</strong>
        <p className="card__backstory">{navatar.backstory}</p>
      </div>

      <style>{`
        .card{border:1px solid #e6e6e6;border-radius:12px;padding:16px;background:#fff;max-width:560px}
        .card__header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}
        .card__title{font-weight:700}
        .card__meta{opacity:.7;font-size:.9rem}
        .card__media{display:flex;justify-content:center;align-items:center;background:#fafafa;border-radius:8px;height:220px;overflow:hidden;margin:8px 0}
        .card__media img{height:100%;object-fit:cover}
        .card__placeholder{color:#aaa}
        .card__section{margin:8px 0}
        .card__backstory{margin:6px 0}
      `}</style>
    </div>
  );
}
