import React from "react";
import { useParams } from "react-router-dom";

const IMAGES: Record<string, { hero: string; spot: string; title: string; native: string }> = {
  thailandia: {
    hero: '/Languages/Mangolanguagemainthai.png',
    spot: '/Languages/Turianlanguagehindi.png', // secondary Turian in local script per your note
    title: 'Thailandia (Thai)',
    native: 'ไทย'
  },
  chinadia: {
    hero: '/Languages/Cranelanguagemainchina.png',
    spot: '/Languages/Turianlanguagechina.png',
    title: 'Chinadia (Mandarin)',
    native: '中文'
  },
  indillandia: {
    hero: '/Languages/Genielanguagemainindi.png',
    spot: '/Languages/Turianlanguagehindi.png',
    title: 'Indillandia (Hindi)',
    native: 'हिंदी'
  },
  brazilandia: {
    hero: '/Languages/Birdlanguagemainbrazil.png',
    spot: '/Languages/Turianlanguagebrazil.png',
    title: 'Brazilandia (Portuguese)',
    native: 'Português'
  },
  australandia: {
    hero: '/Languages/Koalalanguagemain.png',
    spot: '/Languages/Birdlanguageaustralandia.png', // unique secondary as requested
    title: 'Australandia (English)',
    native: 'English'
  },
  amerilandia: {
    hero: '/Languages/Owllanguagemain.png',
    spot: '/Languages/Turianlanguageenglish.png',
    title: 'Amerilandia (English)',
    native: 'English'
  }
};

export default function LanguageDetail() {
  const { slug = "" } = useParams();
  const data = IMAGES[slug];

  if (!data) return <p>Language not found.</p>;

  return (
    <article>
      <nav className="breadcrumb">
        <a href="/">Home</a> / <a href="/naturversity">Naturversity</a> /{' '}
        <a href="/naturversity/languages">Languages</a> / {data.title}
      </nav>

      <h1>
        {data.title} — <span lang="native">{data.native}</span>
      </h1>
      <p>Learn greetings, alphabet basics, and common phrases for {data.title.split(' ')[0]}.</p>

      <img
        src={data.hero}
        alt=""
        className="lang-hero"
        loading="eager"
        decoding="async"
        sizes="(max-width: 1024px) 100vw, 960px"
      />

      {/* lessons/content continue to show right after; big image no longer pushes them away */}
      <section>
        <h2>Starter phrases</h2>
        <ul>
          <li><strong>Hello:</strong> สวัสดี — <em>sà-wàt-dee</em></li>
          <li><strong>Thank you:</strong> ขอบคุณ — <em>khàwp-khun</em></li>
          {/* keep the rest of your content here */}
        </ul>
      </section>

      <img
        src={data.spot}
        alt=""
        className="lang-spot"
        loading="lazy"
        decoding="async"
        sizes="(max-width: 1024px) 100vw, 960px"
      />
    </article>
  );
}

