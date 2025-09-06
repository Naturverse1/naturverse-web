import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { NavTabs } from "../../components/navatar/Tabs";
import { saveCard, loadCard, Card } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function NavatarCardPage() {
  const [card, setCard] = useState<Card>({});

  useEffect(() => {
    loadCard().then((c) => c && setCard(c));
  }, []);

  function update(field: keyof Card, value: any) {
    setCard((c) => ({ ...c, [field]: value }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    await saveCard(card);
    alert("Saved \u2713");
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
      <h1 className="center">Character Card</h1>
      <NavTabs active="card" />
      <form onSubmit={onSave} className="nv-card-form">
        <input
          placeholder="Name"
          value={card.name || ""}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          placeholder="Species / Type"
          value={card.species || ""}
          onChange={(e) => update("species", e.target.value)}
        />
        <input
          placeholder="Kingdom"
          value={card.kingdom || ""}
          onChange={(e) => update("kingdom", e.target.value)}
        />
        <textarea
          rows={4}
          placeholder="Backstory"
          value={card.backstory || ""}
          onChange={(e) => update("backstory", e.target.value)}
        />
        <input
          placeholder="Powers (comma separated)"
          value={(card.powers || []).join(", ")}
          onChange={(e) => update("powers", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        />
        <input
          placeholder="Traits (comma separated)"
          value={(card.traits || []).join(", ")}
          onChange={(e) => update("traits", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        />
        <button className="pill pill--active" type="submit">Save</button>
      </form>
    </main>
  );
}
