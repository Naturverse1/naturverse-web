import React from "react";

type ImgItem = { src?: string; alt: string; label?: string; href?: string };

export default function WorldLayout({
  title,
  blurb,
  heroSrc,
  gallery = [],
  characters = [],
}: {
  title: string;
  blurb: string;
  heroSrc?: string;
  gallery?: ImgItem[];
  characters?: ImgItem[];
}) {
  const hero = heroSrc || "/placeholders/world-hero.jpg";

  return (
    <div className="world-wrap">
      <div className="world-hero">
        <img src={hero} alt={`${title} map`} onError={(e) => ((e.currentTarget.src = "/placeholders/world-hero.jpg"))} />
      </div>

      <h1 className="world-title">{title}</h1>
      <p className="muted">{blurb}</p>

      <section className="world-section">
        <h2>Gallery</h2>
        <div className="world-grid">
          {gallery.length ? (
            gallery.map((g, i) => (
              g.href ? (
                <a key={i} className="world-card" href={g.href}>
                  <img src={g.src || "/placeholders/photo.jpg"} alt={g.alt} />
                  {g.label && <h3>{g.label}</h3>}
                </a>
              ) : (
                <div key={i} className="world-card">
                  <img src={g.src || "/placeholders/photo.jpg"} alt={g.alt} />
                  {g.label && <h3>{g.label}</h3>}
                </div>
              )
            ))
          ) : (
            <div className="world-empty">Coming soon</div>
          )}
        </div>
      </section>

      <section className="world-section">
        <h2>Characters</h2>
        <div className="world-grid">
          {characters.length ? (
            characters.map((c, i) => (
              <div key={i} className="world-card">
                <img src={c.src || "/placeholders/avatar.jpg"} alt={c.alt} />
                {c.label && <h3>{c.label}</h3>}
              </div>
            ))
          ) : (
            <div className="world-empty">Coming soon</div>
          )}
        </div>
      </section>
    </div>
  );
}

