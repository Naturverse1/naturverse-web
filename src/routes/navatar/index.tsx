import { useEffect, useState } from "react";
import { listMyNavatars, navatarImageUrl, NavatarRow } from "../../lib/supabase";
import { Link } from "react-router-dom";

export default function NavatarHome() {
  const [rows, setRows] = useState<NavatarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setRows(await listMyNavatars());
      } catch (e: any) {
        setErr(e.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="Page">
      <nav className="Breadcrumbs">
        <Link to="/">Home</Link> <span>/</span> <span>Navatar</span>
      </nav>

      <h1>Navatar</h1>
      <p>Create a character, customize details, and save your Navatar card.</p>

      <div className="ctaRow">
        <Link className="Button" to="/navatar/create">Create</Link>
      </div>

      <h2>My Navatars</h2>
      {loading && <p>Loading…</p>}
      {err && <p className="Error">{err}</p>}
      <div className="CardGrid">
        {rows.map(r => {
          const url = navatarImageUrl(r.image_path);
          return (
            <div key={r.id} className="NavatarCard">
              <div className="NavatarTitle">{r.name ?? r.base_type}</div>
              <div className="NavatarImg">
                {url ? <img src={url} alt={r.name ?? r.base_type} /> : <div className="NoPhoto">No photo</div>}
              </div>
              <div className="NavatarMeta">
                <span>{r.base_type}</span> • <time>{new Date(r.created_at).toLocaleDateString()}</time>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

