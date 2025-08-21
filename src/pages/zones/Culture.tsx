import { useMemo } from "react";
import { CULTURE_SECTIONS } from "../../data/culture-sections";
import "./Culture.css";

export default function Culture() {
  const items = useMemo(() => CULTURE_SECTIONS, []);
  return (
    <main className="container">
      <h1>🪔 Culture</h1>
      <p className="muted">Beliefs, holidays, and ceremonies across the 14 kingdoms.</p>

      <section className="culture-grid">
        {items.map((k) => (
          <article key={k.id} className="culture-card">
            <header className="culture-head">
              <div className="culture-title">
                <span className="emoji">{k.emoji}</span>
                <h3>{k.kingdom}</h3>
              </div>
              <p className="caption">{k.caption}</p>
            </header>

            <div className="culture-columns">
              <div>
                <h4>Beliefs</h4>
                <ul>{k.beliefs.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
              <div>
                <h4>Holidays</h4>
                <ul>{k.holidays.map((h, i) => <li key={i}><strong>{h.name}</strong> — <em>{h.when}</em>. {h.note}</li>)}</ul>
              </div>
              {k.ceremonies?.length ? (
                <div>
                  <h4>Ceremonies</h4>
                  <ul>{k.ceremonies.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
