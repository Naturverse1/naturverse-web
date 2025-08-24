import React from "react";
import { LANGUAGE_WORLDS } from "../../../data/languages";
import ImageSafe from "../../../components/ImageSafe";

export default function LanguagesIndex() {
  return (
    <div>
      <h1>Languages</h1>
      <div className="cards grid-gap">
        {LANGUAGE_WORLDS.map((it) => (
          <a key={it.slug} className="card" href={`/naturversity/languages/${it.slug}`}>
            {it.thumb && <ImageSafe src={it.thumb} alt={it.name} />}
            <h2>{it.name}</h2>
            <p>Basics, numbers, greetings.</p>
          </a>
        ))}
      </div>
    </div>
  );
}
