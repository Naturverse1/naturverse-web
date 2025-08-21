import Layout from "../components/Layout";
import { CULTURE_SECTIONS } from "../data/culture-sections";

const KINGDOMS = CULTURE_SECTIONS.map(k => ({
  icon: k.emoji,
  name: k.kingdom,
  sub: k.caption,
  beliefs: k.beliefs,
  holidays: k.holidays.map(h => `${h.name} — ${h.when}. ${h.note}`),
  ceremonies: k.ceremonies ?? []
}));

export default function CulturePage(){
  return (
    <Layout
      title={<><span role="img" aria-label="lantern">🪔</span> Culture</>}
      breadcrumbs={<>Zones / Culture</>}
    >
      <p style={{ marginTop: -6, color: "var(--nv-muted)" }}>
        Beliefs, holidays, and ceremonies across the 14 kingdoms.
      </p>

      <div className="culture-grid" style={{ marginTop: 16 }}>
        {KINGDOMS.map((k) => (
          <article key={k.name} className="nv-card culture-card">
            <div>
              <h3>{k.icon} {k.name}</h3>
              <div className="culture-sub">{k.sub}</div>
            </div>

            <div className="culture-columns">
              <section>
                <h4>Beliefs</h4>
                <ul>{k.beliefs.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </section>
              <section>
                <h4>Holidays</h4>
                <ul>{k.holidays.map((h, i) => <li key={i}>{h}</li>)}</ul>
              </section>
              <section>
                <h4>Ceremonies</h4>
                {k.ceremonies.length ? (
                  <ul>{k.ceremonies.map((c, i) => <li key={i}>{c}</li>)}</ul>
                ) : (
                  <div style={{ color: "var(--nv-muted)" }}>—</div>
                )}
              </section>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
