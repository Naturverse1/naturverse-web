import React from "react";
import { LANGUAGES } from "../../../data/languages";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

export default function LanguagesHub() {
  return (
    <div>
      <Breadcrumbs />
      <h1>Languages</h1>
      <p className="muted">Starter phrasebooks for each kingdom. More coming soon.</p>

      <div className="cards">
        {LANGUAGES.map((l) => (
          <a key={l.slug} className="card" href={`/naturversity/languages/${l.slug}`}>
            <img src={l.flagPath} alt={`${l.name} flag`} loading="lazy" />
            <h2>{l.name}</h2>
            <p>{l.nativeName ? `Native: ${l.nativeName}` : " "}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
