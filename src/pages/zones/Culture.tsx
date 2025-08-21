import React from "react";
import { Link } from "react-router-dom";
import { cultureData } from "../../data/culture";

export default function Culture() {
  return (
    <div>
      <h1>🏮 Culture</h1>
      <p>Beliefs, holidays, and ceremonies across the 14 kingdoms.</p>

      <div className="grid">
        {cultureData.map((k) => (
          <div key={k.id} className="card">
            <h3>
              <span aria-hidden>{k.emoji}</span> {k.title}
            </h3>
            <p className="small">{k.blurb}</p>

            <div className="split">
              <div>
                <h4>Beliefs</h4>
                <ul>
                  {k.beliefs.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Holidays</h4>
                <ul>
                  {k.holidays.map((h, i) => (
                    <li key={i}>
                      <strong>{h.name}</strong> — <em>{h.when}</em>. {h.about}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4>Ceremonies</h4>
              <ul>
                {k.ceremonies.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <p className="small coming">
              Coming Soon: seasonal quests, festival badges, and limited-time items.
            </p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 16 }}>
        <Link to="/zones" className="btn">
          ← Back to Zones
        </Link>
      </p>
    </div>
  );
}

