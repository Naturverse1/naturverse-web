import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { NavTabs } from "../../components/navatar/Tabs";
import NavatarFrame from "../../components/navatar/NavatarFrame";
import { loadPublicNavatars, PublicNavatar } from "../../lib/navatar/publicList";
import { setMyNavatar } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function PickNavatarPage() {
  const [items, setItems] = useState<PublicNavatar[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    loadPublicNavatars().then(setItems);
  }, []);

  async function choose(src: string, name: string) {
    const res = await fetch(src);
    const blob = await res.blob();
    const file = new File([blob], "navatar.png", { type: blob.type });
    await setMyNavatar(file, name);
    nav("/navatar");
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Pick" }]} />
      <h1 className="center">Pick Navatar</h1>
      <NavTabs active="pick" />
      <div className="nav-grid">
        {items.map((it) => (
          <NavatarFrame key={it.src} src={it.src} title={it.name} onClick={() => choose(it.src, it.name)} />
        ))}
      </div>
    </main>
  );
}
