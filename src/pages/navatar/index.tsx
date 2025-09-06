import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import NavatarTabs from '../../components/NavatarTabs';
import NavatarCard from '../../components/NavatarCard';
import { useAuthUser } from '../../lib/useAuthUser';
import { getActiveNavatar, navatarImageUrl, CharacterCard } from '../../lib/navatar';
import '../../styles/navatar.css';

export default function MyNavatarPage() {
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<any | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!user) { setLoading(false); return; }
      const { data, error } = await getActiveNavatar(user.id);
      if (ignore) return;
      if (!error) setActive(data);
      setLoading(false);
    })();
    return () => { ignore = true; };
  }, [user]);

  const card: CharacterCard | null = (active?.card && Object.keys(active.card).length > 0) ? active.card : null;
  const imageUrl = navatarImageUrl(active?.image_path ?? null);

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/navatar', label: 'Navatar' }]} />
      <h1 className="center">My Navatar</h1>
      <NavatarTabs />
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start" style={{ marginTop: 8 }}>
          <div>
            <NavatarCard src={imageUrl} title={active?.name || 'Navatar'} />
          </div>
          <section id="card" className="rounded-2xl bg-white/70 border border-blue-200 p-5">
            <h3 className="text-xl font-bold text-blue-700 mb-3">Character Card</h3>
            {!card ? (
              <p className="text-blue-700">
                No card yet.{' '}
                <Link to="/navatar/card" className="underline font-semibold">Create Card</Link>
              </p>
            ) : (
              <div className="text-blue-800 space-y-3">
                {card.name && <p><span className="font-semibold">Name:</span> {card.name}</p>}
                {card.species && <p><span className="font-semibold">Species:</span> {card.species}</p>}
                {card.kingdom && <p><span className="font-semibold">Kingdom:</span> {card.kingdom}</p>}
                {card.backstory && (
                  <div>
                    <p className="font-semibold">Backstory</p>
                    <p className="whitespace-pre-wrap">{card.backstory}</p>
                  </div>
                )}
                {card.powers?.length ? (
                  <div>
                    <p className="font-semibold">Powers</p>
                    <ul className="list-disc ml-6">{card.powers.map((p,i)=><li key={i}>{p}</li>)}</ul>
                  </div>
                ) : null}
                {card.traits?.length ? (
                  <div>
                    <p className="font-semibold">Traits</p>
                    <ul className="list-disc ml-6">{card.traits.map((t,i)=><li key={i}>{t}</li>)}</ul>
                  </div>
                ) : null}
                <div className="pt-2">
                  <Link to="/navatar/card" className="rounded-xl bg-white text-blue-700 border border-blue-200 px-4 py-2">Edit Card</Link>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
