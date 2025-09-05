import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listMyNavatars, NavatarRow } from '../../lib/navatar';
import { useSession } from '../../lib/useSession';

export default function NavatarHome() {
  const { user } = useSession();
  const [items, setItems] = useState<NavatarRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    listMyNavatars(user.id).then(setItems).catch(e => setErr(e.message));
  }, [user]);

  return (
    <div className="page">
      <div className="crumbs">Home / Navatar</div>
      <h1>Navatar</h1>
      <p>Create a character, customize details, and save your Navatar card.</p>
      <div style={{ marginBottom: 16 }}>
        <Link className="btn" to="/navatar/create">Create</Link>
      </div>

      <h2>My Navatars</h2>
      {err && <p className="error">{err}</p>}
      <div className="grid">
        {items.map(n => (
          <div key={n.id} className="card">
            <div className="card-body">
              <div className="card-title">{n.name ?? n.base_type}</div>
              {n.image_url ? (
                <img src={n.image_url} alt={n.name ?? 'Navatar'} />
              ) : (
                <div className="img-empty">No photo</div>
              )}
              <div className="meta">• {new Date(n.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
