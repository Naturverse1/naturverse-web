import { useEffect, useMemo, useState } from 'react';
import { loadCatalog } from '../../features/navatar/api';
import type { CatalogItem, CatalogManifest, NavatarCategory } from '../../features/navatar/types';

const FILTERS: (NavatarCategory | 'all')[] = ['all', 'animal','fruit','insect','spirit','other'];

export default function Pick() {
  const [manifest, setManifest] = useState<CatalogManifest | null>(null);
  const [filter, setFilter] = useState<(NavatarCategory | 'all')>('all');

  useEffect(() => {
    let mounted = true;
    loadCatalog().then(m => { if (mounted) setManifest(m); }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  const items = useMemo<CatalogItem[]>(() => {
    const list = manifest?.items ?? [];
    if (filter === 'all') return list;
    return list.filter(i => i.category === filter);
  }, [manifest, filter]);

  return (
    <section className="nv-section">
      <h2 className="nv-h2">Pick a Preset</h2>
      <div className="nv-filter">
        {FILTERS.map(f => (
          <button key={f} className={'nv-chip' + (filter===f ? ' nv-chip-active' : '')} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="nv-grid">
        {items.map(it => (
          <div key={it.id} className="nv-card">
            <img src={it.image} alt={it.name} />
            <div className="nv-card-meta">
              <div className="nv-card-title">{it.name}</div>
              <div className="nv-card-sub">{it.category}</div>
            </div>
            <button className="nv-btn" disabled /* next PR wires this */>Customize & Save</button>
          </div>
        ))}
      </div>
    </section>
  );
}
