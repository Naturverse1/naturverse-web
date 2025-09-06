import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Preset, Navatar } from "../../types/navatar";
import { saveActive, saveLibrary, loadLibrary, uid } from "../../lib/navatar/local";

export default function Pick() {
  const [items, setItems] = useState<Preset[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/navatars/manifest.json", { cache: "no-store" });
        if (!res.ok) throw new Error("manifest missing");
        const json = await res.json();
        if (alive) setItems(json.items || []);
      } catch {
        // text-only fallback (no binaries in PR)
        setItems([
          { id: "leaf", name: "Leaf Spirit", image: "/navatars/leaf.png", category: "Spirit" },
          { id: "frankie", name: "Frankie Frog", image: "/navatars/frog.png", category: "Animal" }
        ]);
      }
    })();
    return () => { alive = false; };
  }, []);

  function choose(p: Preset) {
    const now = Date.now();
    const nav: Navatar = {
      id: uid(),
      name: p.name,
      imageUrl: p.image,
      base: p.category,
      createdAt: now,
      backstory: "A friendly companion ready for adventures."
    };
    saveActive(nav);
    const lib = loadLibrary<Navatar>();
    saveLibrary([nav, ...lib].slice(0, 50));
    navigate("/navatar");
  }

  return (
    <section className="nv-section">
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Pick</span>
      </nav>
      <h2 className="nv-h2">Pick Navatar</h2>

      <div className="nv-grid nv-grid-big">
        {items.map(it => (
          <button key={it.id} className="nv-card nv-card-btn" onClick={() => choose(it)}>
            {/* If image path missing in your build, the gray placeholder still renders */}
            <img className="nv-img" src={it.image} alt={it.name} onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).querySelector(".nv-ph")?.classList.remove("nv-hidden");
              e.currentTarget.style.display = "none";
            }}/>
            <div className="nv-ph nv-hidden">No photo</div>
            <div className="nv-card-meta">
              <div className="nv-card-title">{it.name}</div>
              <div className="nv-card-sub">{it.category || "Preset"}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
