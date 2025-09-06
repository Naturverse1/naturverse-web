import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import '../../styles/navatar.css';
import { supabase } from '../../lib/supabase-client';

type Row = {
  id: string;
  user_id: string;
  name: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
};

export default function Hub() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('avatars')
        .select('id,user_id,name,category,image_url,created_at')
        .order('created_at', { ascending: false });
      if (!on) return;
      if (error) {
        console.error(error);
        setRows([]);
      } else setRows((data ?? []) as Row[]);
      setLoading(false);
    })();
    return () => {
      on = false;
    };
  }, []);

  const tabs = [
    { to: '/navatar/create', label: 'Create' },
    { to: '/navatar/pick', label: 'Pick' },
    { to: '/navatar/upload', label: 'Upload' },
  ];

  return (
    <main className="nv-wrap">
      {/* Top breadcrumb (blue theme) */}
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <span>Navatar</span>
      </nav>

      {/* Centered header + centered pill tabs */}
      <header className="nv-header">
        <div className="nv-container">
          <h1 className="nv-h1">Navatar</h1>
          <div className="nv-top-tabs" role="tablist" aria-label="Navatar sections">
            <div className="nv-top-tabs-scroll">
              {tabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  role="tab"
                  className={({ isActive }) => 'nv-pill' + (isActive ? ' nv-pill-active' : '')}
                >
                  {t.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Default hub content */}
      {pathname === '/navatar' && (
        <section className="nv-section nv-container">
          <h2 className="nv-h2">My Navatars</h2>
          {loading && <p className="nv-muted">Loading…</p>}
          {!loading && rows.length === 0 && <p className="nv-muted">No Navatars yet.</p>}
          <div className="nv-grid">
            {rows.map((r) => (
              <div key={r.id} className="nv-card">
                {r.image_url ? (
                  <img
                    className="nv-img"
                    src={r.image_url}
                    alt={r.name ?? r.category ?? 'Navatar'}
                  />
                ) : (
                  <div className="nv-ph">No photo</div>
                )}
                <div className="nv-card-meta">
                  <div className="nv-card-title">{r.name ?? r.category ?? 'Navatar'}</div>
                  <div className="nv-card-sub">
                    {(r.category ?? '—') + ' · ' + new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab content renders inside the same centered container */}
      <div className="nv-container">
        <Outlet />
      </div>
    </main>
  );
}
