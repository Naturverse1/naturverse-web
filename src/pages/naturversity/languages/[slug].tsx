import React from "react";
import { useParams } from "react-router-dom";
import { useFadeInOnIntersect } from "../../../components/useFadeInOnIntersect";

const IMAGES: Record<string, { hero: string; spot: string; title: string; native: string }> = {
  thailandia: {
    hero: '/Languages/Mangolanguagemainthai.png',
    spot: '/Languages/Turianlanguage.png',
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
    spot: '/Languages/Birdlanguageaustralandia.png',
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

  const heroRef = useFadeInOnIntersect<HTMLImageElement>();
  const spotRef = useFadeInOnIntersect<HTMLImageElement>();

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
        ref={heroRef}
        className="lang-hero fade-in"
        src={data.hero}
        alt=""
        loading="lazy"
        decoding="async"
      />

      <section>
        <h2>Starter phrases</h2>
        <ul>
          <li><strong>Hello:</strong> สวัสดี — <em>sà-wàt-dee</em></li>
          <li><strong>Thank you:</strong> ขอบคุณ — <em>khàwp-khun</em></li>
        </ul>
      </section>

      <img
        ref={spotRef}
        className="lang-spot fade-in"
        src={data.spot}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </article>
  );
}

