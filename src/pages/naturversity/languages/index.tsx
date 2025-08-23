import React from "react";
import { useFadeInOnIntersect } from "../../../components/useFadeInOnIntersect";

const LANG_CARDS = [
  {
    slug: 'thailandia',
    title: 'Thailandia (Thai)',
    native: 'ไทย',
    cover: '/Languages/Mangolanguagemainthai.png'
  },
  {
    slug: 'chinadia',
    title: 'Chinadia (Mandarin)',
    native: '中文',
    cover: '/Languages/Cranelanguagemainchina.png'
  },
  {
    slug: 'indillandia',
    title: 'Indillandia (Hindi)',
    native: 'हिंदी',
    cover: '/Languages/Genielanguagemainindi.png'
  },
  {
    slug: 'brazilandia',
    title: 'Brazilandia (Portuguese)',
    native: 'Português',
    cover: '/Languages/Birdlanguagemainbrazil.png'
  },
  {
    slug: 'australandia',
    title: 'Australandia (English)',
    native: 'English',
    cover: '/Languages/Koalalanguagemain.png'
  },
  {
    slug: 'amerilandia',
    title: 'Amerilandia (English)',
    native: 'English',
    cover: '/Languages/Owllanguagemain.png'
  }
];

export default function LanguagesIndex() {
  return (
    <section>
      <h1>Languages</h1>
      <p>Phrasebooks for each kingdom.</p>

      <div className="cards-grid">
        {LANG_CARDS.map((k) => {
          const imgRef = useFadeInOnIntersect<HTMLImageElement>();
          return (
            <a key={k.slug} className="card" href={`/naturversity/languages/${k.slug}`}>
              <img
                ref={imgRef}
                className="lang-hero fade-in"
                src={k.cover}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div className="card-body">
                <h3>{k.title}</h3>
                <small>Native: {k.native}</small>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

