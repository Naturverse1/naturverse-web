import React from "react";

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
        {LANG_CARDS.map((k) => (
          <a key={k.slug} className="card" href={`/naturversity/languages/${k.slug}`}>
            <img
              src={k.cover}
              alt=""
              className="lang-hero"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 100vw, 480px"
            />
            <div className="card-body">
              <h3>{k.title}</h3>
              <small>Native: {k.native}</small>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

