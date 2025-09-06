import React from "react";
import type { Navatar } from "../types/navatar";

type Props = { navatar: Navatar };

export default function NavatarCard({ navatar }: Props) {
  return (
    <article id="navatar-card" className="nv-card navatar-card character-card">
      <header className="cc-head">
        <span className="cc-name">{navatar.name || navatar.species}</span>
        <span className="cc-meta">
          {navatar.base} • {new Date(navatar.createdAt).toLocaleDateString()}
        </span>
      </header>

      <div className="imageWrap">
        {navatar.imageUrl ? (
          <img
            src={navatar.imageUrl}
            alt={navatar.name || navatar.species}
            loading="lazy"
          />
        ) : (
          <div className="card__placeholder" aria-label="No photo">No photo</div>
        )}
      </div>

      <dl className="cc-fields">
        <div>
          <dt>Species</dt>
          <dd>{navatar.species}</dd>
        </div>
        <div>
          <dt>Backstory</dt>
          <dd>{navatar.backstory}</dd>
        </div>
      </dl>
    </article>
  );
}
