import React from "react";
import WorldLayout from "./_WorldLayout";

type Character = { name: string; src: string };

export default function AntarctilandWorld() {
  const [chars, setChars] = React.useState<Character[]>([]);

  React.useEffect(() => {
    fetch("/kingdoms/Antarctiland/manifest.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setChars(Array.isArray(data) ? data : []))
      .catch(() => setChars([]));
  }, []);

  return (
    <WorldLayout title="Antarctiland" mapSrc="/kingdoms/Antarctiland/Antarctilandmap.png">
      {/* Characters */}
      <section className="characters">
        <h2>Characters</h2>
        <div className="characters-grid">
          {chars.map((c) => (
            <article key={c.src} className="character-card">
              <img src={c.src} alt={c.name} loading="lazy" decoding="async" />
              <div className="name">{c.name}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery placeholder (kept for later) */}
      <section style={{ marginTop: 28 }}>
        <h2>Gallery</h2>
        <div className="gallery-placeholder">Coming soon</div>
      </section>
    </WorldLayout>
  );
}
