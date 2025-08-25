import React from "react";
import type { Navatar } from "../types/navatar";

type Props = { navatar: Navatar };

export default function NavatarCard({ navatar }: Props) {
  return (
    <div className="character-card">
      <article className="ccard">
        <div className="ccard-hero">
          {navatar.imageDataUrl ? (
            <img
              src={navatar.imageDataUrl}
              alt={navatar.name || navatar.species}
              loading="lazy"
            />
          ) : (
            <div className="card__placeholder" aria-label="No photo">No photo</div>
          )}
        </div>

        <div className="ccard-head">
          <div className="left">
            <span className="sprout" aria-hidden="true">🌿</span>
            <strong className="name">{navatar.name || navatar.species}</strong>
          </div>
          <div className="right">
            {navatar.base} • {new Date(navatar.createdAt).toLocaleDateString()}
          </div>
        </div>

        <p><span className="label">Species:</span> {navatar.species}</p>
        <p><span className="label">Powers:</span> {navatar.powers.join(" · ")}</p>
        <p>
          <span className="label">Backstory:</span> {navatar.backstory}
        </p>
      </article>
    </div>
  );
}
