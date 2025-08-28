import React from "react";
import { SEED_QUESTS } from "../../data/quests";
import { listAllQuests } from "../../utils/quests-store";
import "../../components/market.css";

export default function QuestsList() {
  const quests = listAllQuests(SEED_QUESTS);

  return (
    <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }}>
      <h1>Mini-Quests</h1>
      <p style={{ opacity:.8, marginTop:0 }}>Small, focused adventures you can do anywhere.</p>

      <div style={{ display:"flex", gap:10, margin:"12px 0 18px" }}>
        <a className="btn" href="/quests/new">Create a quest</a>
      </div>

      <div className="market-grid">
        {quests.map(q => (
          <article key={q.id} className="product">
            <a className="product__image" href={`/quests/${q.slug}`} aria-label={`Open ${q.title}`}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:36,background:"#f2f4f7"}}>⭐</div>
            </a>
            <div className="product__body">
              <h3 className="product__title"><a href={`/quests/${q.slug}`}>{q.title}</a></h3>
              <p className="product__summary">{q.summary}</p>
              <p className="product__meta"><span className="product__cat">{q.kingdom || "General"}</span></p>
              <div className="product__actions">
                <a className="btn ghost" href={`/quests/${q.slug}`}>Open</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
