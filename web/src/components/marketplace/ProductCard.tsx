import { getNavatar } from '../../lib/navatar';
import type { Item } from '../../lib/catalog';

export default function ProductCard({ item }: { item: Item }) {
  const navatar = getNavatar();
  return (
    <div className="product-card">
      <div className="thumb" style={{ position: 'relative' }}>
        <img src={item.img} alt={item.name} />
        {navatar && (
          <img
            src={navatar.image}
            alt="navatar"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '35%',
              borderRadius: '50%',
              border: '2px solid #fff',
            }}
          />
        )}
      </div>
      <h3>{item.name}</h3>
      <p>{item.price} NATUR</p>
    </div>
  );
}

