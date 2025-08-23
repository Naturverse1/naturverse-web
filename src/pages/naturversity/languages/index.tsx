import React from "react";
import { LANGUAGES } from "../../../data/languages";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SafeImg from "../../../components/SafeImg";

export default function LanguagesHub() {
  return (
      <div className="page-wrap">
        <Breadcrumbs items={[{ href:"/", label:"Home" }, { href:"/naturversity", label:"Naturversity" }, { label:"Languages" }]} />
        <h1>Languages</h1>
      <p className="muted">Starter phrasebooks for each kingdom. More coming soon.</p>

      <div className="cards">
        {LANGUAGES.map((l) => (
          <a key={l.slug} className="card" href={`/naturversity/languages/${l.slug}`}>
              <SafeImg src={l.flagPath} alt={`${l.name} flag`} width={800} height={450} />
            <h2>{l.name}</h2>
            <p>{l.nativeName ? `Native: ${l.nativeName}` : " "}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
