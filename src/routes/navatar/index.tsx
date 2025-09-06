import { getActiveNavatar, getCard } from '../../lib/navatar';
import { useEffect, useState } from 'react';
import { useSession } from '../../lib/session';
import { Link } from 'react-router-dom';
import { NavatarPills } from '../../components/NavatarPills';

export default function NavatarHub() {
  const { user } = useSession();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const active = await getActiveNavatar(user.id);
      setActiveId(active?.id ?? null);
      if (active?.id) {
        const c = await getCard(user.id, active.id);
        setCard(c);
      }
    })();
  }, [user?.id]);

  return (
    <div className="container mx-auto px-4">
      <nav className="text-sm mb-4"><Link to="/">Home</Link> / Navatar</nav>
      <h1 className="text-4xl font-extrabold text-[color:var(--nv-blue-900)]">Navatar</h1>
      <div className="mt-4">
        <NavatarPills active="home" />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>{/* existing Navatar card (unchanged) */}</div>

        <div className="rounded-2xl border border-[color:var(--nv-blue-200)] bg-[color:var(--nv-blue-200)]/30 p-5">
          <h3 className="text-xl font-extrabold text-[color:var(--nv-blue-900)] mb-2">My Navatar</h3>
          {!card ? (
            <div className="text-[color:var(--nv-blue-900)]/80">No card yet.</div>
          ) : (
            <div className="space-y-3 text-[color:var(--nv-blue-900)]">
              {card.name && <Row label="Name" value={card.name} />}
              {card.species && <Row label="Species" value={card.species} />}
              {card.kingdom && <Row label="Kingdom" value={card.kingdom} />}
              {card.backstory && <Row label="Backstory" value={card.backstory} />}
              {card.powers?.length && <Row label="Powers" value={card.powers.join(', ')} />}
              {card.traits?.length && <Row label="Traits" value={card.traits.join(', ')} />}
            </div>
          )}
          <div className="mt-4">
            <Link className="nv-btn-outline" to="/navatar/card">{card ? 'Edit Card' : 'Create Card'}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-semibold">{label}</div>
      <div>{value}</div>
    </div>
  );
}

