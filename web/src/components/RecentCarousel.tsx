import React from 'react';
import { getRecent } from '../lib/recent';
import { getProduct } from '../lib/products';

export default function RecentCarousel() {
  const [ids, setIds] = React.useState<string[]>(getRecent().slice(0, 12));

  React.useEffect(() => {
    const onStore = () => setIds(getRecent().slice(0, 12));
    window.addEventListener('storage', onStore);
    window.addEventListener('recent:update', onStore as any);
    return () => {
      window.removeEventListener('storage', onStore);
      window.removeEventListener('recent:update', onStore as any);
    };
  }, []);

  const items = ids
    .map(id => getProduct(id))
    .filter(Boolean)
    .map(p => ({ id: p!.id, name: p!.name, img: (p as any).img || (p as any).image }));

  if (!items.length) return null;

  return (
    <section className="panel" style={{ padding: '12px' }}>
      <h3 style={{ margin: '0 0 8px' }}>Recently viewed</h3>
      <div className="recent-row">
        {items.map(it => (
          <a key={it.id} href={`/marketplace/item?id=${it.id}`} className="recent-card" aria-label={it.name}>
            <img src={it.img} alt="" />
          </a>
        ))}
      </div>
    </section>
  );
}
