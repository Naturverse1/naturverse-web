import React, { useEffect, useState } from 'react';
import { listAll, getOwned, getActive, setActive } from '../lib/navatar';
import { Navatar } from '../data/navatars';
import NavatarCard from '../components/NavatarCard';
import ListNavatarModal from '../components/ListNavatarModal';
import { useAuth } from '../lib/auth-context';

export default function YourNavatarPage() {
  const [all, setAll] = useState<Navatar[]>([]);
  const [owned, setOwned] = useState<string[]>([]);
  const [active, setActiveId] = useState<string | null>(null);
  const { user } = useAuth();
  const [listingFor, setListingFor] = useState<string | undefined>();

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
            <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <NavatarCard
                nav={n}
                owned={true}
                activeId={active}
                onGet={() => {}}
                onUse={onUse}
              />
              {user && (
                <button
                  onClick={() => setListingFor(n.id)}
                  style={{ padding: '6px 10px', borderRadius: 8 }}
                >
                  List for sale
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {listingFor && user && (
        <ListNavatarModal
          navatarId={listingFor}
          sellerUserId={user.id}
          onClose={() => setListingFor(undefined)}
          onListed={async () => {}}
        />
      )}
    </div>
  );
}
