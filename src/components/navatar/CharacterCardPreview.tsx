import { Card } from "../../lib/navatar";

export function CharacterCardPreview({ card }: { card?: Card }) {
  return (
    <section className="nv-card">
      <h3 className="nv-card__title">My Navatar</h3>
      <dl>
        <dt>Backstory</dt><dd>{card?.backstory || "No backstory yet."}</dd>
        <dt>Powers</dt><dd>{(card?.powers?.join(", ")) || "—"}</dd>
        <dt>Traits</dt><dd>{(card?.traits?.join(", ")) || "—"}</dd>
        <dt>Kingdom</dt><dd>{card?.kingdom || "—"}</dd>
      </dl>
    </section>
  );
}
export default CharacterCardPreview;
