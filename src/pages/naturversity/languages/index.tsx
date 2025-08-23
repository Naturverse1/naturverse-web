import { Link } from "react-router-dom";
import { LANGUAGES } from "../../../data/languages";

export default function LanguagesIndex() {
  return (
    <main className="wrap">
      <nav className="breadcrumb"><Link to="/naturversity">Home</Link> / Languages</nav>
      <h1>Languages</h1>
      <p>Basics for each kingdom’s language.</p>

      <div className="grid cards">
        {LANGUAGES.map(lang => (
          <Link key={lang.id} to={`/naturversity/languages/${lang.id}`} className="card">
            <div className="card-media">
              {lang.cover ? (
                <img
                  src={lang.cover}
                  alt={`${lang.name} cover`}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              ) : (
                <div className="media-placeholder" />
              )}
            </div>
            <div className="card-body">
              <h3>{lang.name}</h3>
              <div style={{ opacity: 0.75 }}>Native: {lang.native}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
