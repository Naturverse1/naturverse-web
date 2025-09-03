import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import { getMyAvatar } from '../../lib/avatars';
import './Navatar.css';

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

  if (loading)
    return (
      <div className="nv-Page">
        <h1>Your Navatar</h1>
        <p>Loading…</p>
      </div>
    );

  return (
    <div className="nv-Page">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Navatar' }]} />
      <h1>Your Navatar</h1>

      {mine ? (
        <div className="nv-Card" style={{ textAlign: 'center' }}>
          <img className="nv-Img" src={mine.image_url} alt={mine.name || 'Navatar'} />
          <div style={{ fontWeight: 700, fontSize: 24, marginTop: 12 }}>{mine.name || 'Navatar'}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="nv-PrimaryBtn" to="/navatar/pick">Pick Navatar</Link>
            <Link className="nv-PrimaryBtn" to="/navatar/upload">Upload</Link>
            <Link className="nv-PrimaryBtn" to="/navatar/generate">Describe &amp; Generate</Link>
          </div>
        </div>
      ) : (
        <div className="nv-Card" style={{ textAlign: 'center' }}>
          <p>No Navatar yet — pick one below.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link className="nv-PrimaryBtn" to="/navatar/pick">Pick Navatar</Link>
            <Link className="nv-PrimaryBtn" to="/navatar/upload">Upload</Link>
            <Link className="nv-PrimaryBtn" to="/navatar/generate">Describe &amp; Generate</Link>
          </div>
        </div>
      )}
    </div>
  );
}
