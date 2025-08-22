import React from "react";

type Props = { worldKey: string; title: string; intro: string; mapSrc: string };

// map our internal key to the actual folder name in /public/kingdoms
const folderByKey: Record<string, string> = {
  thailandia: "Thailandia",
  brazilandia: "Brazilandia",
  chilandia: "Chilandia",
  indillandia: "Indillandia",
  australandia: "Australandia",
  amerilandia: "Amerilandia",
};

type Character = { name: string; src: string };

export default function WorldPage({ worldKey, title, intro, mapSrc }: Props) {
  const [chars, setChars] = React.useState<Character[] | null>(null);

  React.useEffect(() => {
    const folder = folderByKey[worldKey];
    if (!folder) return setChars([]);
    fetch(`/kingdoms/${folder}/manifest.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setChars(Array.isArray(data) ? data : []))
      .catch(() => setChars([]));
  }, [worldKey]);

  return (
    <div className="world-page">
      <section className="hero">
        <h2>🌏 {title} map</h2>
        <div className="hero-img">
          <img src={mapSrc} alt={`${title} map`} />
        </div>
      </section>

      <h1>🌍 {title}</h1>
      <p className="muted">{intro}</p>

      <section className="section">
        <h2>Characters</h2>
        {chars === null ? (
          <div className="coming-soon">Loading…</div>
        ) : chars.length ? (
          <ul className="card-grid">
            {chars.map((c) => (
              <li className="card" key={c.src}>
                <img src={c.src} alt={c.name} loading="lazy" />
                <h3>{c.name}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <div className="coming-soon">Coming soon</div>
        )}
      </section>

      <section className="section">
        <h2>Gallery</h2>
        <div className="coming-soon">Coming soon</div>
      </section>
    </div>
  );
}
