import React, { useEffect, useState } from 'react';
import { listAll, getOwned, own, getActive, setActive } from '../../lib/navatar';
import type { Navatar, Rarity } from '../../data/navatars';
import NavatarCard from '../../components/NavatarCard';

export default function NavatarMarketplacePage() {
  const [all, setAll] = useState<Navatar[]>([]);
  const [owned, setOwned] = useState<string[]>([]);
  const [active, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Rarity | 'all'>('all');

  useEffect(() => {
    listAll().then(setAll);
    getOwned().then(setOwned);
    getActive().then(setActiveId);
  }, []);

  const filtered = all.filter((a) => (filter === 'all' ? true : a.rarity === filter));

  async function onGet(id: string) {
    await own(id);
    setOwned(await getOwned());
  }

  async function onUse(id: string) {
    await setActive(id);
    setActiveId(await getActive());
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
      <h1>Navatar Marketplace</h1>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="all">All</option>
          <option value="starter">Starter</option>
          <option value="rare">Rare</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 240px)', gap: 16 }}>
        {filtered.map((n) => (
          <NavatarCard
            key={n.id}
            nav={n}
            owned={owned.includes(n.id)}
            activeId={active}
            onGet={onGet}
            onUse={onUse}
          />
        ))}
      </div>
    </div>
  );
}
