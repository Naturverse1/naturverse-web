import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import CharacterCardPreview from "../../components/CharacterCardPreview";
import { getMyAvatar } from "../../lib/avatars";
import { useAuth } from "../../lib/auth-context";
import "../../styles/navatar.css";

export default function MyNavatarPage() {
  const { user } = useAuth();
  const [row, setRow] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    (async () => setRow(await getMyAvatar(user.id)))();
  }, [user]);

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }]} />
      <h1 className="center">My Navatar</h1>
      <NavatarTabs />

      <div className="navatar-two-col" style={{ marginTop: "1rem" }}>
        <div className="navatar-card">
          {row?.image_url ? (
            <img className="navatar-img" src={row.image_url} alt={row?.name || 'My Navatar'} />
          ) : (
            <div className="navatar-img" style={{
              background: '#f3f6ff',
              display: 'grid',
              placeItems: 'center',
              color: '#9aa3b2'
            }}>No photo</div>
          )}
          <div style={{ padding: '0.8rem 1rem 1rem', textAlign: 'center', fontWeight: 700 }}>
            {row?.name || 'My Navatar'}
          </div>
        </div>

        <CharacterCardPreview card={row?.card} />
      </div>
    </main>
  );
}
