import { LANGUAGES } from "../../../data/languages";

export default function LanguagesPage() {
  return (
    <main className="container py-6">
      <h1>Languages</h1>
      <p>Phrasebooks for each kingdom.</p>

      <div className="lang-grid">
        {Object.entries(LANGUAGES).map(([slug, data]) => (
          <a key={slug} className="lang-card" href={`/naturversity/languages/${slug}`}>
            <img src={data.thumb} alt="" loading="lazy" width={96} height={96} />
            <div>
              <h3>{titleFor(slug as any)} <small className="muted">— Native: {data.nativeName}</small></h3>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}

function titleFor(slug: keyof typeof LANGUAGES) {
  return {
    thailandia: "Thailandia (Thai)",
    chinadia: "Chinadia (Mandarin)",
    indillandia: "Indillandia (Hindi)",
    brazilandia: "Brazilandia (Portuguese)",
    australandia: "Australandia (English)",
  }[slug];
}
