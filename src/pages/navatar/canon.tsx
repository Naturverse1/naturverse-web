import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { supabase, upsertCanonNavatar } from '../../lib/supabase';
import catalog from '../../data/navatar-canon.json';
import './navatar.css';

type Canon = { id: string; name: string; path: string };

export default function NavatarCanon() {
  const items = useMemo(() => catalog as Canon[], []);
  const [userId, setUserId] = useState<string | null>(null);
  const [picked, setPicked] = useState<Canon | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  async function onSave() {
    if (!userId || !picked) return;
    try {
      setSaving(true);
      await upsertCanonNavatar(userId, picked.name, picked.path);
      setSaving(false);
      history.back();
    } catch (e: any) {
      setSaving(false);
      setErr(e?.message || 'Save failed');
      alert('Error saving Navatar');
    }
  }

  return (
    <div className="nv-wrap">
      <Breadcrumbs items={[{ to: '/', label: 'Home' }, { to: '/navatar', label: 'Navatar' }, { label: 'Pick Canon' }]} />
      <h1>Pick Canon Navatar</h1>

      <div className="nv-grid-wrap">
        <div className="nv-grid">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setPicked(it)}
              className={`nv-card ${picked?.id === it.id ? 'is-picked' : ''}`}
            >
              <img src={it.path} alt={it.name} loading="lazy" />
              <div className="nv-card-name">{it.name}</div>
            </button>
          ))}
        </div>
      </div>

      {err && <div className="nv-error">{err}</div>}
      <div className="nv-actions">
        <button className="nv-save" disabled={!picked || saving} onClick={onSave}>
          {saving ? 'Saving…' : picked ? `Save “${picked.name}”` : 'Pick one to save'}
        </button>
      </div>
    </div>
  );
}

