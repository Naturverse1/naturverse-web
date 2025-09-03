import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "@/styles/navatar.css";
import { listMyNavatars } from "@/lib/api/navatar";
import { setCurrent } from "@/lib/navatar/store";

export default function PickNavatar() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    listMyNavatars().then((res: any[]) => setItems(res)).catch(() => {});
  }, []);

  function pick(x: any) {
    setCurrent({
      name: x.name || "",
      species: x.species || "",
      base: x.base || "",
      photo: x.image_url,
    });
  }

  return (
    <div className="nv-wrap">
      <nav className="nv-crumbs">
        <Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / <span>Pick</span>
      </nav>
      <h1 className="nv-h1">Pick Navatar</h1>

      <div className="nv-grid">
        {items.map(x => (
          <button key={x.id} className="nv-tile" onClick={() => pick(x)}>
            <div className="img"><img src={x.image_url} alt="Navatar option" /></div>
          </button>
        ))}
      </div>
    </div>
  );
}
