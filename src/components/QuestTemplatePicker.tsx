import React from "react";
import { QUEST_TEMPLATES, QuestTemplate } from "../data/questTemplates";
import "./quest-templates.css";

export default function QuestTemplatePicker({
  onUse
}: {
  onUse: (tpl: QuestTemplate) => void;
}) {
  return (
    <div className="qt-grid" role="list">
      {QUEST_TEMPLATES.map(t => (
        <article key={t.key} className="qt-card" role="listitem">
          <header className="qt-head">
            <h3 className="qt-title">{t.title}</h3>
            {t.kingdom && <span className="qt-tag">{t.kingdom}</span>}
          </header>
          <p className="qt-sum">{t.summary}</p>
          <ul className="qt-steps">
            {t.steps.map((s, i) => <li key={s.id}><b>Step {i+1}:</b> {s.text}</li>)}
          </ul>
          <div className="qt-actions">
            <button className="btn" type="button" onClick={() => onUse(t)}>Use this template</button>
          </div>
        </article>
      ))}
    </div>
  );
}

