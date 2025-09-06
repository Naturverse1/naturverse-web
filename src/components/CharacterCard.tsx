import React from "react";
import type { CharacterCard } from "../lib/types";

export default function CharacterCardView({ card }: { card?: CharacterCard | null }) {
  return (
    <div className="nv-card">
      <h3 className="nv-card-title">Character Card</h3>

      {card ? (
        <div className="nv-card-body">
          <p><b>Name:</b> {card.name}</p>
          <p><b>Species:</b> {card.species}</p>
          <p><b>Kingdom:</b> {card.kingdom}</p>

          {!!card.backstory && (
            <>
              <p><b>Backstory</b></p>
              <p>{card.backstory}</p>
            </>
          )}

          {!!card.powers?.length && (
            <>
              <p><b>Powers</b></p>
              <ul>{card.powers.map((p, i) => <li key={i}>— {p}</li>)}</ul>
            </>
          )}

          {!!card.traits?.length && (
            <>
              <p><b>Traits</b></p>
              <ul>{card.traits.map((t, i) => <li key={i}>— {t}</li>)}</ul>
            </>
          )}
        </div>
      ) : (
        <div className="nv-card-empty">No card yet.</div>
      )}
    </div>
  );
}
