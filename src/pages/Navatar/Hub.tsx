import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/navatar.css';

export default function Hub() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // TODO: replace with your live list if you have Supabase wired; leaving simple placeholders for now.
  const myNavatars: any[] = [];

  return (
    <main className="nv-wrap">
      <nav className="nv-breadcrumb nv-bc-blue">
        <Link to="/">Home</Link> <span>/</span> <span>Navatar</span>
      </nav>

      <header className="nv-header nv-center">
        <h1 className="nv-title">Your Navatar</h1>
        <div className="nv-pill-row" role="tablist" aria-label="Navatar actions">
          <NavLink to="/navatar/pick" className="nv-pill">Pick Navatar</NavLink>
          <NavLink to="/navatar/upload" className="nv-pill">Upload</NavLink>
          <NavLink to="/navatar/generate" className="nv-pill">Describe &amp; Generate</NavLink>
        </div>
      </header>

      {pathname === '/navatar' && (
        <section className="nv-section nv-center">
          {myNavatars.length === 0 ? (
            <p className="nv-muted">No Navatar yet — pick one above.</p>
          ) : (
            <>
              <h2 className="nv-h2">My Navatars</h2>
              <div className="nv-grid">
                {myNavatars.map((n: any) => (
                  <div key={n.id} className="nv-card">
                    {n.image_url ? (
                      <img className="nv-img" src={n.image_url} alt={n.name || 'Navatar'} />
                    ) : (
                      <div className="nv-ph">No photo</div>
                    )}
                    <div className="nv-card-meta">
                      <div className="nv-card-title">{n.name || 'Navatar'}</div>
                      <div className="nv-card-sub">{new Date(n.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <div className="nv-center"><Outlet /></div>
    </main>
  );
}

