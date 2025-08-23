import React from "react";
import WorldLayout from "./_WorldLayout";
import { Img } from "../../components";
import Breadcrumbs from "../../components/Breadcrumbs";

type Character = { name: string; src: string };

export default function AfricanaWorld() {
  const [chars, setChars] = React.useState<Character[]>([]);

  React.useEffect(() => {
    fetch("/kingdoms/Africana/manifest.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setChars(Array.isArray(data) ? data : []))
      .catch(() => setChars([]));
  }, []);

  return (
    <div className="page-wrap">
      <Breadcrumbs items={[{ href:"/", label:"Home" }, { href:"/worlds", label:"Worlds" }, { label:"Africana" }]} />
      <WorldLayout title="Africana" mapSrc="/kingdoms/Africana/Africanamap.png">
      {/* Characters */}
      <section className="characters">
        <h2>Characters</h2>
        <div className="characters-grid">
          {chars.map((c) => (
            <article key={c.src} className="character-card">
                <Img src={c.src} alt={c.name} width={800} height={450} />
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
    </div>
  );
}
