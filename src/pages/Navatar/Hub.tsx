import { useEffect, useState } from 'react';
import { listMyNavatars } from '../../features/navatar/api';
import type { NavatarRow } from '../../features/navatar/types';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import '../../styles/navatar.css';

export default function Hub() {
  const [rows, setRows] = useState<NavatarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    listMyNavatars().then((r) => { if (mounted) { setRows(r); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  const tabs = [
    { to: '/navatar/create', label: 'Create' },
    { to: '/navatar/pick',   label: 'Pick' },
    { to: '/navatar/upload', label: 'Upload' }
  ];

  return (
    <main className="nv-wrap">
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <span>Navatar</span>
      </nav>

      <h1 className="nv-h1">Navatar</h1>

      <div className="nv-tabs">
        {tabs.map(t => (
          <NavLink key={t.to} to={t.to} className={({isActive}) => 'nv-tab' + (isActive ? ' nv-active' : '')}>
            {t.label}
          </NavLink>
        ))}
      </div>

      {/* Sub-hub content renders here */}
      {pathname === '/navatar' ? (
        <p className="nv-muted">Choose a tab above to start, or browse your saved Navatars below.</p>
      ) : null}
      <Outlet />

      <section className="nv-section">
        <h2 className="nv-h2">My Navatars</h2>
        {loading && <p className="nv-muted">Loading…</p>}
        {!loading && rows.length === 0 && <p className="nv-muted">No Navatars yet.</p>}
        <div className="nv-grid">
          {rows.map((r) => (
            <div key={r.id} className="nv-card">
              {r.image_url ? (
                <img src={r.image_url} alt={r.name ?? r.category ?? 'Navatar'} />
              ) : (
                <div className="nv-ph">No photo</div>
              )}
              <div className="nv-card-meta">
                <div className="nv-card-title">{r.name ?? (r.category ?? 'Navatar')}</div>
                <div className="nv-card-sub">{(r.category ?? '—') + ' · ' + new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
