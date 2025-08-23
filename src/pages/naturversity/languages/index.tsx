import { Link } from "react-router-dom";
import "../../../styles/cards-unify.css";

/** Shared map → ensures correct images + copy per language */
export const LANGUAGES = [
  {
    slug: "thailandia",
    name: "Thailandia (Thai)",
    native: "ไทย",
    thumb: "/Languages/Mangolanguagemainthai.png",
    hero: "/Languages/Mangolanguagemainthai.png",
    secondary: "/Languages/Turianlanguagehindi.png" // Turian secondary per your note
  },
  {
    slug: "chinadia",
    name: "Chinadia (Mandarin)",
    native: "中文",
    thumb: "/Languages/Cranelanguagemainchina.png",
    hero: "/Languages/Cranelanguagemainchina.png",
    secondary: "/Languages/Turianlanguagechina.png"
  },
  {
    slug: "indillandia",
    name: "Indillandia (Hindi)",
    native: "हिंदी",
    thumb: "/Languages/Genielanguagemainindi.png",
    hero: "/Languages/Genielanguagemainindi.png",
    secondary: "/Languages/Turianlanguagehindi.png"
  },
  {
    slug: "brazilandia",
    name: "Brazilandia (Portuguese)",
    native: "Português",
    thumb: "/Languages/Birdlanguagemainbrazil.png",
    hero: "/Languages/Birdlanguagemainbrazil.png",
    secondary: "/Languages/Turianlanguagebrazil.png"
  },
  {
    slug: "australandia",
    name: "Australandia (English)",
    native: "English",
    thumb: "/Languages/Koalalanguagemain.png",
    hero: "/Languages/Koalalanguagemain.png",
    secondary: "/Languages/Turianlanguageenglish.png"
  },
  // You can enable this when you want Amerilandia as a distinct English variant:
  // {
  //   slug: "amerilandia",
  //   name: "Amerilandia (English)",
  //   native: "English",
  //   thumb: "/Languages/Owllanguagemain.png",
  //   hero: "/Languages/Owllanguagemain.png",
  //   secondary: "/Languages/Turianlanguageenglish.png"
  // },
];

export default function LanguagesIndex() {
  return (
    <main className="page">
      <h1>Languages</h1>
      <p>Phrasebooks for each kingdom.</p>

      <section className="grid-langs" data-testid="langs-grid">
        {LANGUAGES.map((l) => (
          <Link to={`/naturversity/languages/${l.slug}`} className="lang-card" key={l.slug}>
            <img
              className="lang-thumb"
              src={l.thumb}
              alt=""
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
            />
            <div className="lang-meta">
              <h3 className="lang-name">{l.name}</h3>
              <div className="lang-native">Native: <span>{l.native}</span></div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

