import React from "react";

export type CharacterItem = { name: string; file: string }; // file includes extension

export default function CharacterGrid({ items, basePath }: {
  items: CharacterItem[];
  basePath: string; // e.g. "/kingdoms/Thailandia"
}) {
  if (!items?.length) return null;
  return (
    <div className="char-grid">
      {items.map((it) => {
        const src = `${basePath}/${encodeURIComponent(it.file)}`;
        return (
          <figure className="char" key={it.file}>
            <img src={src} alt={it.name} loading="lazy" />
            <figcaption>{it.name}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
