import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { NavTabs } from "../../components/navatar/Tabs";
import NavatarFrame from "../../components/navatar/NavatarFrame";
import CharacterCardPreview from "../../components/navatar/CharacterCardPreview";
import { getMyNavatar, loadCard, NavatarRow, Card } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const [navatar, setNavatar] = useState<NavatarRow | null>(null);
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    getMyNavatar().then(setNavatar);
    loadCard().then(setCard);
  }, []);

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      <h1 className="center">My Navatar</h1>
      <NavTabs active="home" />
      <div className="nv-home-grid">
        <NavatarFrame src={navatar?.url || undefined} title={navatar?.name || "My Navatar"} />
        <CharacterCardPreview card={card || undefined} />
      </div>
    </main>
  );
}
