import { useParams } from "react-router-dom";
import { LANGUAGES, LangSlug } from "../../../data/languages";

export default function LanguageDetail() {
  const { slug } = useParams<{ slug: LangSlug }>();
  const data = LANGUAGES[(slug ?? "thailandia") as LangSlug];

  return (
    <main className="container py-6">
      <nav className="breadcrumb"><a href="/naturversity">Naturversity</a> / <a href="/naturversity/languages">Languages</a> / {titleFor(slug as LangSlug)}</nav>
      <h1>{titleFor(slug as LangSlug)} — <span className="muted">{data.nativeName}</span></h1>
      <img className="lang-hero" src={data.poster} alt="" loading="eager" />

      <section className="stack-md">
        <h3>Starter phrases</h3>
        <ul>
          <li><strong>Hello:</strong> {data.hello.native} — {data.hello.roman}</li>
          <li><strong>Thank you:</strong> {data.thankyou.native} — {data.thankyou.roman}</li>
        </ul>

        <h3>Alphabet basics</h3>
        <p className="muted">{data.alphabetBasics.join(" · ")}</p>

        <h3>Count to ten</h3>
        <ol className="nums">
          {data.numbers.map((n, i) => (
            <li key={i}><strong>{i+1}.</strong> {n.native} — {n.roman}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}

function titleFor(slug: LangSlug) {
  return {
    thailandia: "Thailandia (Thai)",
    chinadia: "Chinadia (Mandarin)",
    indillandia: "Indillandia (Hindi)",
    brazilandia: "Brazilandia (Portuguese)",
    australandia: "Australandia (English)",
  }[slug];
}
