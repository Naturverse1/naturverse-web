import { useMemo } from "react";
import { loadActive } from "../../../lib/localStorage";

export function CharacterCardPreview({ navatarId }: { navatarId?: string }) {
  const navatar = useMemo(() => loadActive<any>(), []);
  return (
    <aside className="card panel card-preview">
      <h3 className="card-title">My Navatar</h3>
      <dl className="card-fields">
        <dt>Backstory</dt>
        <dd>{navatar?.backstory || "No backstory yet."}</dd>
        <dt>Powers</dt>
        <dd>{navatar?.powers?.join(", ") || "—"}</dd>
        <dt>Traits</dt>
        <dd>{navatar?.traits?.join(", ") || "—"}</dd>
      </dl>
    </aside>
  );
}
