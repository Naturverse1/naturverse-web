import { useEffect, useState } from 'react';
import { callFn } from '../../lib/api';
import type { ParentControls } from '../../types/naturversity';

export default function ParentsPage() {
  const [controls, setControls] = useState<ParentControls | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await callFn('nv-parent', 'GET');
      if (res?.ok) setControls(res.data as ParentControls);
    })();
  }, []);

  async function save() {
    setSaving(true);
    const res = await callFn('nv-parent', 'POST', controls);
    if (res?.ok) setControls(res.data as ParentControls);
    setSaving(false);
  }

  if (!controls) return <main className="page"><h1>Parent Controls</h1><p>Loading…</p></main>;

  return (
    <main className="page">
      <h1>Parent Controls</h1>
      <label>
        <input
          type="checkbox"
          checked={!!controls.content_locked}
          onChange={e => setControls({ ...controls!, content_locked: e.target.checked })}
        />
        Lock mature content
      </label>

      <div style={{marginTop:12}}>
        <label>Spending limit (NATUR)</label>
        <input
          type="number"
          value={controls.spending_limit ?? 0}
          onChange={e => setControls({ ...controls!, spending_limit: Number(e.target.value || 0) })}
        />
      </div>

      <button onClick={save} disabled={saving} style={{marginTop:12}}>
        {saving ? 'Saving…' : 'Save'}
      </button>
    </main>
  );
}
