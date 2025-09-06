import { useEffect, useState } from "react";
import HubPills from "../../components/HubPills";
import {
  getMyNavatar,
  listMyNavatars,
  setPrimaryNavatar,
  loadCard,
} from "../../lib/navatar";
import "../../styles/navatar.css";

export default function NavatarHome() {
  const [primary, setPrimary] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const [p, all] = await Promise.all([getMyNavatar(), listMyNavatars()]);
      setPrimary(p);
      setList(all);
      if (p) setCard(await loadCard(p.id));
    })();
  }, []);

  const onPickPrimary = async (id: string) => {
    const p = await setPrimaryNavatar(id);
    setPrimary(p);
    setCard(await loadCard(p.id));
    setList(await listMyNavatars());
  };

  return (
    <div className="container">
      {/* pills: visible on hub, hidden on sub-routes via CSS media + prop */}
      <HubPills isHub />

      <h1>My Navatar</h1>

      <div className="two-col">
        <div>
          <div className="navatar-frame">
            {primary?.url ? (
              <img
                src={primary.url}
                alt={primary.name ?? "My Navatar"}
                loading="lazy"
              />
            ) : (
              <div className="placeholder center">No photo</div>
            )}
          </div>

          {list.length > 1 && (
            <>
              <h4 style={{ marginTop: 16 }}>My Gallery</h4>
              <div className="gallery">
                {list.map((n) => (
                  <button
                    key={n.id}
                    className={`thumb ${n.is_primary ? "is-primary" : ""}`}
                    onClick={() => onPickPrimary(n.id)}
                    aria-label={`Set ${n.name ?? "Navatar"} as primary`}
                  >
                    <img src={n.url} alt={n.name ?? "Navatar"} loading="lazy" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card-panel">
          <h3 style={{ textAlign: "center" }}>My Navatar</h3>
          <hr />
          <p>
            <strong>Backstory</strong>
            <br />
            {card?.backstory ?? "No backstory yet."}
          </p>
          <p>
            <strong>Powers</strong>
            <br />
            {(card?.powers ?? ["—"]).join(", ")}
          </p>
          <p>
            <strong>Traits</strong>
            <br />
            {(card?.traits ?? ["—"]).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}

