import Page from "../_layout/Page";
import BackBar from "../../components/BackBar";
import "./culture.css";

export default function Culture() {
  return (
    <>
      <BackBar title="Culture" />
      <Page>
        <h1>🧧 Culture</h1>
        <p className="nv-muted">Beliefs, holidays, and ceremonies across the 14 kingdoms.</p>

        <div className="culture-grid">
          {/* keep your existing kingdom cards; only class names changed below */}
          {/* Example card wrapper */}
          <section className="culture-card">
            <header className="culture-card__head">
              <h3>🌸 🛕 Thailandia</h3>
              <p className="culture-card__sub">Coconuts & Elephants</p>
            </header>
            <div className="culture-card__cols">
              <div>
                <h4>Beliefs</h4>
                <ul className="kv-list">
                  <li>Kindness, merit, and harmony with nature.</li>
                  <li>Respect for water, forests, and elephants as guardian spirits.</li>
                </ul>
              </div>
              <div>
                <h4>Holidays</h4>
                <ul className="kv-list">
                  <li>
                    <strong>Songkran (Water Festival)</strong> — Mid-April. New year blessing with water, gratitude, renewal.
                  </li>
                  <li>
                    <strong>Loy Krathong</strong> — Full-moon of the 12th lunar month. Lanterns & floating baskets thanking rivers and letting go of worries.
                  </li>
                </ul>
              </div>
              <div>
                <h4>Ceremonies</h4>
                <ul className="kv-list">
                  <li>Dawn offerings to temples.</li>
                  <li>Water blessings before journeys or new quests.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* …repeat your other kingdom cards unchanged, just ensure lists use className="kv-list" */}
        </div>
      </Page>
    </>
  );
}

