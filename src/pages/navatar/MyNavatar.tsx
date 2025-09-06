import { Link } from "react-router-dom";
import { loadActive, saveActive, loadLibrary, saveLibrary, uid } from "../../lib/navatar/local";
import type { Navatar } from "../../types/navatar";

const defaultBackstory =
  "Born in the animal realm, this explorer protects habitats and cheers friends across the 14 kingdoms.";

export default function MyNavatar() {
  const active: Navatar | null = loadActive<Navatar>();
  const created = active?.createdAt ? new Date(active.createdAt).toLocaleDateString() : "";

  return (
    <section className="nv-section">
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <span>Navatar</span> <span>/</span>
        <span>My Navatar</span>
      </nav>

      {!active && <p className="nv-muted">No Navatar yet — pick, upload, or generate one above.</p>}

      {active && (
        <div className="nv-card nv-card--wide">
          {active.imageUrl ? (
            <img className="nv-img" src={active.imageUrl} alt={active.name || "Navatar"} />
          ) : (
            <div className="nv-ph">No photo</div>
          )}

          <div className="nv-card-meta">
            <div className="nv-card-title">{active.name || "My Navatar"}</div>
            <div className="nv-card-sub">{created}</div>
            <p className="nv-desc">{active.backstory || defaultBackstory}</p>

            <div className="nv-actions">
              <button
                className="nv-btn-blue"
                onClick={() => {
                  const lib = loadLibrary<Navatar>();
                  const copy = { ...active, id: uid(), createdAt: Date.now() };
                  saveActive(copy);
                  saveLibrary([copy, ...lib].slice(0, 50));
                  alert("Set Active ✓");
                }}
              >
                Set Active
              </button>
              <a className="nv-btn-outline" href="/marketplace">Make Merch</a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
