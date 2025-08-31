import React, { useMemo, useState } from 'react';
import { ZONES } from '../data/catalog';

export default function ZonesExplorer() {
  const [tag, setTag] = useState<string>('all');
  const allTags = useMemo(() => {
    const s = new Set<string>();
    ZONES.forEach(z => (z.tags ?? []).forEach(t => s.add(t)));
    return ['all', ...[...s].sort()];
  }, []);

  const filtered = useMemo(
    () => tag === 'all' ? ZONES : ZONES.filter(z => z.tags?.includes(tag)),
    [tag]
  );

  return (
    <main className="nv-container">
      <header className="nv-header">
        <h1>Zones Explorer</h1>
        <label>
          Filter:
          <select value={tag} onChange={e => setTag(e.target.value)}>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </header>

      <div className="nv-grid">
        {filtered.map(z => (
          <a key={z.id} className="nv-card" href={z.href} aria-label={`${z.title} zone`}>
            <strong>{z.title}</strong>
            {z.subtitle && <span>{z.subtitle}</span>}
            {z.tags && <div className="nv-tags">{z.tags.map(t => <span key={t} className="nv-pill">{t}</span>)}</div>}
          </a>
        ))}
      </div>
    </main>
  );
}
