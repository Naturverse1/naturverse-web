import { useEffect, useState } from 'react';
import { listMyNavatars, navatarImageUrl, NavatarRow } from '../../lib/navatar';
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

      <header className="nv-header">
        <h1 className="nv-h1">Navatar</h1>

        {/* Marketplace-style top tabs */}
        <div className="nv-top-tabs" role="tablist" aria-label="Navatar sections">
          <div className="nv-top-tabs-scroll">
            {tabs.map(t => (
              <NavLink
                key={t.to}
                to={t.to}
                role="tab"
                className={({isActive}) => 'nv-pill' + (isActive ? ' nv-pill-active' : '')}
              >
                {t.label}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Sub-page content renders here */}
      {(pathname === '/navatar') && (
        <p className="nv-muted nv-intro">Choose a tab above to start, or browse your saved Navatars below.</p>
      )}
      <Outlet />

      <section className="nv-section">
        <div className="nv-section-head">
          <h2 className="nv-h2">My Navatars</h2>
        </div>

        {loading && <p className="nv-muted">Loading…</p>}
        {!loading && rows.length === 0 && <p className="nv-muted">No Navatars yet.</p>}

        <div className="nv-grid">
          {rows.map((r) => {
            const url = navatarImageUrl(r.image_path);
            return (
              <div key={r.id} className="nv-card">
                {url ? (
                  <img src={url} alt={r.name ?? r.base_type ?? 'Navatar'} />
                ) : (
                  <div className="nv-ph">No photo</div>
                )}
                <div className="nv-card-meta">
                  <div className="nv-card-title">{r.name ?? (r.base_type ?? 'Navatar')}</div>
                  <div className="nv-card-sub">
                    {(r.base_type ?? '—') + ' · ' + new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
