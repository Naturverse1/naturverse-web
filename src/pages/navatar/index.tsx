import { useEffect, useState } from 'react';
import { getMyAvatar } from '../../lib/avatars';
import { Link } from 'react-router-dom';
import '../../styles/breadcrumbs.css';
import '../navatar.css';

export default function NavatarHub() {
  const [loading, setLoading] = useState(true);
  const [mine, setMine] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try { setMine(await getMyAvatar()); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="container"><h1>Your Navatar</h1><p>Loading…</p></div>;

  return (
    <div className="container">
      <nav className="breadcrumbs"><Link to="/">Home</Link> / Navatar</nav>
      <h1>Your Navatar</h1>

      {mine ? (
        <>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:12}}>
            <img src={mine.image_url} alt={mine.name} style={{width:320, height:320, objectFit:'cover', borderRadius:24}}/>
            <div style={{fontWeight:700, fontSize:24}}>{mine.name}</div>
            <div className="hub-actions">
              <Link className="btn" to="/navatar/pick">Pick Navatar</Link>
              <Link className="btn" to="/navatar/upload">Upload</Link>
              <Link className="btn" to="/navatar/generate">Describe &amp; Generate</Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>No Navatar yet — pick one below.</p>
          <div className="hub-actions">
            <Link className="btn" to="/navatar/pick">Pick Navatar</Link>
            <Link className="btn" to="/navatar/upload">Upload</Link>
            <Link className="btn" to="/navatar/generate">Describe &amp; Generate</Link>
          </div>
        </>
      )}
    </div>
  );
}
