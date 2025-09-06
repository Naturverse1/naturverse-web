import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavatarCard from "../../components/NavatarCard";
import { listMyNavatars, navatarImageUrl, NavatarRow } from "../../lib/navatar";
import { setActiveNavatar } from "../../lib/localNavatar";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<NavatarRow[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    listMyNavatars().then(setItems).catch(() => {});
  }, []);

  return (
    <main className="container">
      <h1 className="center">Pick Navatar</h1>
      <div className="nav-grid">
        {items.map((avatar) => (
          <button
            key={avatar.id}
            className="linklike"
            onClick={() => {
              setActiveNavatar(avatar.id);
              nav("/navatar");
            }}
            aria-label={`Pick ${avatar.name ?? avatar.base_type}`}
            style={{ background: "none", border: 0, padding: 0, textAlign: "inherit" }}
          >
            <NavatarCard
              src={navatarImageUrl(avatar.image_path)}
              title={avatar.name ?? avatar.base_type}
            />
          </button>
        ))}
      </div>
    </main>
  );
}
