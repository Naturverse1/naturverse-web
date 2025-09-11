import { useEffect, useState } from 'react';
import { listMyAvatars, pickActiveAvatar } from '../../lib/navatar';
import { useAuth } from '../../lib/auth-context';
import { useNavigate } from 'react-router-dom';
import NavatarBreadcrumbs from '../../components/NavatarBreadcrumbs';
import '../../styles/navatar.css';

export default function PickNavatar() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) return;
    listMyAvatars(user.id).then(setRows).catch(console.error);
  }, [user]);

  if (!user) return <div className="navatar-shell"><p>Please sign in.</p></div>;

  return (
    <div className="navatar-shell">
      <NavatarBreadcrumbs />
      <h1>Pick Navatar</h1>
      <div className="grid">
        {rows.map((a) => (
          <button
            key={a.id}
            className="card-300"
            onClick={async () => {
              await pickActiveAvatar(user.id, a.id);
              nav('/navatar');
            }}
            style={{ cursor: 'pointer', border: a.is_primary ? '3px solid #2563eb' : '3px solid transparent' }}
            title="Pick this Navatar"
          >
            <img src={a.thumbnail_url || a.image_url || ''} alt={a.name || 'Navatar'} />
            <div className="center" style={{ padding: 8, fontWeight: 700 }}>{a.name || 'Unnamed'}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
