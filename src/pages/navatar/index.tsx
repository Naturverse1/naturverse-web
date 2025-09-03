import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getMyAvatar } from '../../lib/avatars';

export default function NavatarHub() {
  const [loading, setLoading] = useState(true);
  const [mine, setMine] = useState<any>(null);
  const [searchParams] = useSearchParams();

  async function loadMyNavatar() {
    setLoading(true);
    try {
      setMine(await getMyAvatar());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadMyNavatar(); }, []);
  useEffect(() => {
    if (searchParams.get('refresh')) loadMyNavatar();
  }, [searchParams]);

  if (loading) return <div className="container"><h1>Your Navatar</h1><p>Loading…</p></div>;

  return (
    <div className="container">
      <nav className="nv-breadcrumbs brand-blue">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <span>Navatar</span>
      </nav>
      <h1>Your Navatar</h1>

      {mine ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <img
              src={mine.image_url}
              alt={mine.name || 'Navatar'}
              style={{ width: 320, height: 480, objectFit: 'cover', borderRadius: 24 }}
            />
            <div style={{ fontWeight: 700, fontSize: 24 }}>{mine.name || 'Navatar'}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link className="btn" to="/navatar/pick">Pick Navatar</Link>
              <Link className="btn" to="/navatar/upload">Upload</Link>
              <Link className="btn" to="/navatar/generate">Describe &amp; Generate</Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>No Navatar yet — pick one below.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link className="btn" to="/navatar/pick">Pick Navatar</Link>
            <Link className="btn" to="/navatar/upload">Upload</Link>
            <Link className="btn" to="/navatar/generate">Describe &amp; Generate</Link>
          </div>
        </>
      )}
    </div>
  );
}
