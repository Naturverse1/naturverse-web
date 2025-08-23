import { Link } from "react-router-dom";
import { LANGUAGES } from "../../../data/languages";

export default function LanguagesList() {
  const langs = LANGUAGES.map((l) => ({
    slug: l.slug,
    name: l.name,
    nativeName: l.nativeName,
    img: l.heroImg,
  }));

  return (
    <main className="wrap">
      <h1>Languages</h1>
      <p className="kicker">Phrasebooks for each kingdom.</p>

      {langs.map((l) => (
        <div key={l.slug} className="grid-stack">
          <img
            src={`/Languages/${l.img}`}
            alt={`${l.name} cover`}
            width={96}
            height={96}
            loading="lazy"
            className="img-thumb"
          />
          <div>
            <Link to={`/naturversity/languages/${l.slug}`}><strong>{l.name}</strong></Link>
            <div className="kicker">Native: {l.nativeName}</div>
          </div>
        </div>
      ))}
    </main>
  );
}
