import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getMyLatestNavatar, NavatarRow } from '../../lib/navatar';
import { Link, useSearchParams } from 'react-router-dom';

export default function NavatarHub() {
  const [navatar, setNavatar] = useState<NavatarRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      try {
        const row = await getMyLatestNavatar(user.id);
        setNavatar(row ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const flash = params.get('flash');

  return (
    <main className="page">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link> / <span>Navatar</span>
      </nav>

      <h1>Your Navatar</h1>

      {flash === 'saved' && <p role="status" style={{color:'#2563eb'}}>Saved!</p>}

      {loading ? (
        <p>Loading…</p>
      ) : navatar ? (
        <section style={{display:'grid',placeItems:'center',gap:12}}>
          <img
            src={navatar.image_url ?? ''}
            alt={navatar.name ?? 'Your Navatar'}
            style={{width:180,height:180,objectFit:'cover',borderRadius:18,boxShadow:'0 6px 18px rgba(0,0,0,.08)'}}
          />
          <div style={{fontWeight:600}}>{navatar.name ?? 'Navatar'}</div>
          <Link className="btn" to="/navatar/pick">Change</Link>
        </section>
      ) : (
        <>
          <p>No Navatar yet — pick one below.</p>
          <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',margin:'16px 0'}}>
            <Link className="btn" to="/navatar/pick">Pick Navatar</Link>
            <Link className="btn" to="/navatar?mode=upload">Upload</Link>
            <Link className="btn" to="/navatar?mode=generate">Describe &amp; Generate</Link>
          </div>
          <p>Choose from our characters. <Link to="/navatar/pick">Open</Link></p>
        </>
      )}
    </main>
  );
}
