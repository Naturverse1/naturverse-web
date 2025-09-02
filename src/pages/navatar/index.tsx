import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import './navatar.css';

type Row = { name: string; path: string; kind: string };

export default function NavatarHub() {
  const [row, setRow] = useState<Row | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('avatars')
        .select('name,path,kind')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setRow(data as Row);
    })();
  }, []);

  return (
    <div className="nv-wrap">
      <h1>Your Navatar</h1>

      {row ? (
        <div className="nv-current">
          <img src={row.path} alt={row.name} />
          <div className="nv-current-meta">
            <div className="nv-name">{row.name}</div>
            <div className="nv-kind">({row.kind})</div>
          </div>
        </div>
      ) : (
        <p>No Navatar yet — pick one below.</p>
      )}

      <div className="nv-cards">
        <Link to="/navatar/canon" className="nv-card">
          <div className="nv-card-title">Pick Canon</div>
          <p>Choose from our characters.</p>
        </Link>

        <Link to="/navatar/upload" className="nv-card is-muted">
          <div className="nv-card-title">Upload</div>
          <p>Coming next.</p>
        </Link>

        <Link to="/navatar/generate" className="nv-card is-muted">
          <div className="nv-card-title">Describe & Generate</div>
          <p>Coming next.</p>
        </Link>
      </div>
    </div>
  );
}

