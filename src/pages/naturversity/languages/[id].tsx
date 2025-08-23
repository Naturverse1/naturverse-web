import { useParams, Link } from "react-router-dom";
import { getLanguageById } from "../../../data/languages";

export default function LanguageDetail() {
  const { id = "" } = useParams();
  const lang = getLanguageById(id);

  if (!lang) {
    return (
      <main className="wrap">
        <nav className="breadcrumb"><Link to="/naturversity">Home</Link> / <Link to="/naturversity/languages">Languages</Link></nav>
        <h1>Language not found</h1>
        <p>We couldn’t find that language. Try another one.</p>
      </main>
    );
  }

  return (
    <main className="wrap">
      <nav className="breadcrumb">
        <Link to="/naturversity">Home</Link> / <Link to="/naturversity/languages">Languages</Link> / {lang.name}
      </nav>

      <div className="stack-lg">
        <header className="stack-sm">
          <h1>{lang.name} — <span style={{ opacity: 0.75 }}>{lang.native}</span></h1>
          <p>Learn greetings, alphabet basics, and common phrases for {lang.name.split(" ")[0]}.</p>
        </header>

        {lang.cover && (
          <img
            src={lang.cover}
            alt={`${lang.name} cover`}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
        )}

        {lang.detail && (
          <img
            src={lang.detail}
            alt={`${lang.name} detail`}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
        )}
      </div>
    </main>
  );
}
