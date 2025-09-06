import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import CharacterCard from "../../components/CharacterCard";
import { loadActive, saveActive } from "../../lib/navatar/storage";
import { Navatar } from "../../lib/navatar/types";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const navigate = useNavigate();
  const [n, setN] = React.useState<Navatar | null>(loadActive<Navatar>());

  function setActive() {
    if (!n) return;
    saveActive(n);
    alert("Set as active ✓");
  }

  return (
    <main className="nv-wrap">
      <h1 className="nv-title">My Navatar</h1>
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Navatar" }, { label: "My Navatar" }]} />
      <NavatarTabs />

      <section className="nv-pane">
        <CharacterCard n={n} />
        {n && (
          <div className="row gap">
            <button className="btn" onClick={setActive}>Set Active</button>
            <button className="btn secondary" onClick={() => navigate("/marketplace")}>Make Merch</button>
          </div>
        )}
      </section>
    </main>
  );
}
