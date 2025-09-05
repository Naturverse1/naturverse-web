import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import NavatarCard from '../../components/NavatarCard';
import { getSession, listNavatars, type Navatar } from '../../lib/navatar';

export default function NavatarHome() {
  const [items, setItems] = useState<Navatar[]>([]);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    getSession().then(s => {
      setAuthed(!!s);
      if (s) listNavatars().then(setItems).catch(console.error);
    });
  }, []);

  return (
    <main className="wrap">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Navatar' }]} />
      <h1>Navatar</h1>
      <p className="muted">Create a character, customize details, and save your Navatar card.</p>

      <div className="actions">
        <Link className="btn" to="/navatar/create">Create</Link>
        {/* Future tabs: Upload, Picks, Library */}
      </div>

      {!authed && (
        <div className="sign-in-nudge">
          Please sign in to save Navatars.
        </div>
      )}

      {authed && (
        <>
          <h2 className="h2">My Navatars</h2>
          {items.length === 0 ? (
            <div className="empty">No Navatars yet — click <strong>Create</strong> to make one!</div>
          ) : (
            <div className="grid">
              {items.map(n => <NavatarCard key={n.id} n={n} />)}
            </div>
          )}
        </>
      )}
    </main>
  );
}

