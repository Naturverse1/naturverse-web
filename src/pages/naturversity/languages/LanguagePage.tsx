import React, { useState } from "react";
import type { LangData } from "../../../data/languages/types";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

export default function LanguagePage({ data }: { data: LangData }) {
  const [showRoman, setShowRoman] = useState(true);

  return (
    <div>
      <Breadcrumbs />
      <div className="lang-hero">
        <img className="flag" src={data.flagPath} alt={`${data.name} flag`} loading="lazy" />
        <h1>{data.name}{data.nativeName ? ` — ${data.nativeName}` : ""}</h1>
      </div>

      {data.heroPath && (
        <div className="lang-heroimg">
          <img src={data.heroPath} alt={`${data.name} map`} loading="lazy" />
        </div>
      )}

      <div className="lang-toggles">
        <label className="switch">
          <input
            type="checkbox"
            checked={showRoman}
            onChange={(e) => setShowRoman(e.target.checked)}
          />
          <span>Show romanization</span>
        </label>
      </div>

      <div className="cards">
        <div className="card">
          <h2>Phrasebook</h2>
          <table className="table">
            <thead><tr><th>English</th><th>Native</th><th>Romanization</th></tr></thead>
            <tbody>
              {data.phrasebook.map((p, i) => (
                <tr key={i}>
                  <td>{p.key}</td>
                  <td>{p.native}</td>
                  <td>{showRoman ? (p.roman || "—") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Numbers 1–10</h2>
          <div className="grid2">
            {data.numbers.map((n) => (
              <div key={n.value} className="pill">
                <strong>{n.value}</strong> — {n.native}
                {showRoman && n.roman ? <span className="muted"> ({n.roman})</span> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Colors</h2>
          <div className="grid2">
            {data.colors.map((c, i) => (
              <div key={i} className="pill">
                <strong>{c.en}</strong> — {c.native}
                {showRoman && c.roman ? <span className="muted"> ({c.roman})</span> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Flashcards & Audio</h2>
          <p className="muted">Coming soon — practice decks and audio playback.</p>
        </div>

        {data.notes?.length ? (
          <div className="card">
            <h2>Notes</h2>
            <ul>
              {data.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
