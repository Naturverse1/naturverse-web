import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyNavatar } from '../../lib/supabase/navatars';
import '../../styles/navatar.css';

export default function NavatarHub() {
  const [mine, setMine] = useState<any>(null);

  useEffect(() => {
    getMyNavatar().then(setMine).catch(() => setMine(null));
  }, []);

  return (
    <div className="navatar-wrap">
      <div className="navatar-breadcrumbs">Home / Navatar</div>
      <h1 className="navatar-title">Your Navatar</h1>

      {mine ? (
        <div style={{display:'flex', gap:16, alignItems:'center', margin:'8px 0 24px'}}>
          <img src={mine.src} alt={mine.label} style={{width:96, height:96, borderRadius:12, objectFit:'cover'}} />
          <div>
            <div style={{fontWeight:700}}>{mine.label}</div>
            <div><Link to="/navatar/pick">Change</Link></div>
          </div>
        </div>
      ) : (
        <div style={{margin:'6px 0 24px'}}>No Navatar yet — pick one below.</div>
      )}

      <div className="navatar-cards">
        <div className="navatar-card">
          <h3>Pick Navatar</h3>
          <p>Choose from our characters.</p>
          <Link to="/navatar/pick">Open</Link>
        </div>
        <div className="navatar-card">
          <h3>Upload</h3>
          <p>Coming next.</p>
          <Link to="/navatar/upload">View</Link>
        </div>
        <div className="navatar-card">
          <h3>Describe &amp; Generate</h3>
          <p>Coming next.</p>
          <Link to="/navatar/generate">View</Link>
        </div>
      </div>
    </div>
  );
}

