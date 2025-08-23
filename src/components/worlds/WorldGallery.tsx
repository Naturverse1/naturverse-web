import React from "react";
import ImageSmart from "../ImageSmart";

type Char = { name: string; img: string; role?: string };

export default function WorldGallery({
  mapSrc,
  alt,
  characters = [],
}: {
  mapSrc: string;
  alt: string;
  characters?: Char[];
}) {
  return (
    <>
      <figure className="world-hero">
        <ImageSmart src={mapSrc} alt={alt} priority />
      </figure>

      <section aria-labelledby="gallery" className="world-section">
        <h2 id="gallery">Gallery</h2>
        {characters.length ? (
          <div className="char-grid">
            {characters.map((c) => (
              <article key={c.name} className="char-card">
                <ImageSmart src={c.img} alt={c.name} />
                <h3>{c.name}</h3>
                {c.role && <p className="muted">{c.role}</p>}
              </article>
            ))}
          </div>
        ) : (
          <div className="soon">Coming soon</div>
        )}
      </section>
    </>
  );
}
