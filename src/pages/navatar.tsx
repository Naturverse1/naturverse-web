import React, { useEffect, useState } from 'react';
import { listAll, getOwned, getActive, setActive } from '../lib/navatar';
import { Navatar } from '../data/navatars';
import NavatarCard from '../components/NavatarCard';

export default function YourNavatarPage() {
  const [all, setAll] = useState<Navatar[]>([]);
  const [owned, setOwned] = useState<string[]>([]);
  const [active, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    listAll().then(setAll);
    getOwned().then(setOwned);
    getActive().then(setActiveId);
  }, []);

  const mine = all.filter((n) => owned.includes(n.id));

  async function onUse(id: string) {
    await setActive(id);
    setActiveId(await getActive());
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
      <h1>Your Navatar</h1>
      {mine.length === 0 ? (
        <p>
          You don’t own any Navatars yet. Visit the <a href="/marketplace/navatar">Marketplace</a> to
          get one.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 240px)', gap: 16 }}>
          {mine.map((n) => (
            <NavatarCard
              key={n.id}
              nav={n}
              owned={true}
              activeId={active}
              onGet={() => {}}
              onUse={onUse}
            />
          ))}
        </div>
      )}
    </div>
  );
}
