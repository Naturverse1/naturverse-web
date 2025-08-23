import { Link, useParams } from "react-router-dom";
import "../../../styles/cards-unify.css";
import { LANGUAGES } from "./index";

type Lesson = {
  hello: string;
  thanks: string;
  alphabet: string[];
  numbers: string[];
};

const LESSONS: Record<string, Lesson> = {
  thailandia: {
    hello: "สวัสดี — sà-wàt-dee",
    thanks: "ขอบคุณ — khàwp-khun",
    alphabet: ["ก (gor)", "ข (khor)", "ค (khor)", "ง (ngor)", "จ (jor)"],
    numbers: ["๑ nûeng", "๒ sŏng", "๓ săam", "๔ sìi", "๕ hâa", "๖ hòk", "๗ jèt", "๘ bpàet", "๙ găo", "๑๐ sìp"]
  },
  chinadia: {
    hello: "你好 — nǐ hǎo",
    thanks: "谢谢 — xièxie",
    alphabet: ["(Pinyin) a", "o", "e", "i", "u", "ü"],
    numbers: ["一 yī", "二 èr", "三 sān", "四 sì", "五 wǔ", "六 liù", "七 qī", "八 bā", "九 jiǔ", "十 shí"]
  },
  indillandia: {
    hello: "नमस्ते — namaste",
    thanks: "धन्यवाद — dhanyavād",
    alphabet: ["अ a", "आ ā", "इ i", "ई ī", "उ u"],
    numbers: ["१ ek", "२ do", "३ tīn", "४ chār", "५ pāñch", "६ chhah", "७ sāt", "८ āṭh", "९ nau", "१० das"]
  },
  brazilandia: {
    hello: "Olá",
    thanks: "Obrigado / Obrigada",
    alphabet: ["a", "e", "i", "o", "u"],
    numbers: ["um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"]
  },
  australandia: {
    hello: "Hello",
    thanks: "Thank you",
    alphabet: ["a", "e", "i", "o", "u"],
    numbers: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
  },
};

export default function LanguageDetail() {
  const { slug } = useParams();
  const lang = LANGUAGES.find((l) => l.slug === slug);
  const lesson = LESSONS[slug ?? ""];

  if (!lang) {
    return (
      <main className="page">
        <h1>Language not found</h1>
        <p>Try another language from the list.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <nav className="crumbs">
        <Link to="/naturversity">Naturversity</Link> / <Link to="/naturversity/languages">Languages</Link> / {lang.name}
      </nav>

      <h1>{lang.name} — <span className="native">{lang.native}</span></h1>
      <p>Learn greetings, alphabet basics, and common phrases for {lang.name.split(" ")[0]}.</p>

      <figure className="hero">
        <img src={lang.hero} alt="" className="hero__img" loading="eager" />
      </figure>

      {lesson && (
        <>
          <section className="lesson">
            <h2>Starter phrases</h2>
            <ul>
              <li><strong>Hello:</strong> {lesson.hello}</li>
              <li><strong>Thank you:</strong> {lesson.thanks}</li>
            </ul>
          </section>

          <section className="lesson">
            <h2>Alphabet basics</h2>
            <p>{lesson.alphabet.join(" · ")}</p>
          </section>

          <section className="lesson">
            <h2>Count to ten</h2>
            <ol>
              {lesson.numbers.map((n, i) => <li key={i}>{n}</li>)}
            </ol>
          </section>
        </>
      )}

      <figure className="secondary">
        <img src={lang.secondary} alt="" className="secondary__img" loading="lazy" />
      </figure>
    </main>
  );
}

