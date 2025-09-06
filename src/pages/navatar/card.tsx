import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import CharacterCardPreview from "../../components/CharacterCardPreview";
import CharacterCardEditor from "../../components/CharacterCardEditor";
import { getMyAvatar, saveAvatarCard, NavatarCard } from "../../lib/avatars";
import { useAuth } from "../../lib/auth-context";
import "../../styles/navatar.css";

export default function CardPage() {
  const { user } = useAuth();
  const [card, setCard] = useState<NavatarCard | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const row = await getMyAvatar(user.id);
      setCard(row?.card ?? null);
    })();
  }, [user]);

  async function handleSave(next: NavatarCard) {
    if (!user) return;
    await saveAvatarCard(user.id, next);
    setCard(next);
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
      <h1 className="center">Character Card</h1>
      <NavatarTabs />

      <div className="navatar-two-col" style={{ marginTop: "1rem" }}>
        <CharacterCardPreview card={card} />
        <CharacterCardEditor initial={card} onSave={handleSave} />
      </div>
    </main>
  );
}
