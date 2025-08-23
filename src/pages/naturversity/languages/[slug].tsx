import { Link, useParams } from "react-router-dom";
import { getLanguage } from "../../../data/languages";

export default function LanguageDetail() {
  const { slug } = useParams();
  const data = getLanguage(slug!);

  if (!data) {
    return (
      <main className="wrap">
        <p>Language not found.</p>
      </main>
    );
  }

  return (
    <main className="wrap">
      <nav className="kicker">
        <Link to="/naturversity">Naturversity</Link> / <Link to="/naturversity/languages">Languages</Link> / {data.name}
      </nav>
      <h1>
        {data.name} — <span className="kicker">{data.nativeName}</span>
      </h1>
      <p className="kicker">
        Learn greetings, alphabet basics, and common phrases for {data.region}.
      </p>

      <img
        src={`/Languages/${data.heroImg}`}
        alt={`${data.name} welcome board`}
        className="img-hero"
      />
      <img
        src={`/Languages/${data.secondaryImg}`}
        alt={`${data.name} classroom`}
        className="img-hero"
      />

      <section>
        <h2>Starter phrases</h2>
        <ul>
          {data.starter.map((p) => (
            <li key={p.en}>
              <strong>{p.en}:</strong> {p.native} — <em>{p.romanized}</em>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Alphabet basics</h2>
        <p className="kicker">{data.alphabet.note}</p>
      </section>

      <section>
        <h2>Count to ten</h2>
        <ol>
          {data.count.slice(0, 10).map((n) => (
            <li key={n.num}>
              <strong>{n.num}.</strong> {n.native} — <em>{n.romanized}</em>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
