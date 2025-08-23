import React from "react";

export default function LanguagesIndex() {
  const items = [
    {
      slug: 'thailandia',
      name: 'Thailandia (Thai)',
      native: 'ไทย',
      img: '/Languages/Mangolanguagemainthai.png',
    },
    {
      slug: 'chinadia',
      name: 'Chinadia (Mandarin)',
      native: '中文',
      img: '/Languages/Cranelanguagemainchina.png',
    },
    {
      slug: 'indillandia',
      name: 'Indillandia (Hindi)',
      native: 'हिंदी',
      img: '/Languages/Genielanguagemainindi.png',
    },
    {
      slug: 'brazilandia',
      name: 'Brazilandia (Portuguese)',
      native: 'Português',
      img: '/Languages/Birdlanguagemainbrazil.png',
    },
    {
      slug: 'australandia',
      name: 'Australandia (English)',
      native: 'English',
      img: '/Languages/Koalalanguagemain.png',
    },
    {
      slug: 'amerilandia',
      name: 'Amerilandia (English)',
      native: 'English',
      img: '/Languages/Owllanguagemain.png',
    },
  ];

  return (
    <main>
      <h1>Languages</h1>
      <p>Phrasebooks for each kingdom.</p>

      {items.map((it) => (
        <div className="lang-list" key={it.slug}>
          <img className="lang-thumb" src={it.img} alt="" loading="lazy" />
          <div>
            <a href={`/naturversity/languages/${it.slug}`}><strong>{it.name}</strong></a>
            <div>Native: <em>{it.native}</em></div>
          </div>
        </div>
      ))}
    </main>
  );
}

