import { Link } from 'react-router-dom';
import type { Product } from '../../types/marketplace';

const PRODUCTS: Product[] = [
  {
    sku: 'PLUSH_TUR',
    title: 'Turian Plush',
    basePriceNatur: 120,
    thumb: '/assets/market/plush.png',
  },
  {
    sku: 'COSTUME_HAL',
    title: 'Halloween Costume',
    basePriceNatur: 200,
    thumb: '/assets/market/costume.png',
    options: { size: ['XS', 'S', 'M', 'L'], color: ['Black', 'Orange'] },
  },
  {
    sku: 'STICKER_STD',
    title: 'Sticker Pack',
    basePriceNatur: 20,
    thumb: '/assets/market/sticker.png',
  },
  {
    sku: 'TEE_KIDS',
    title: 'Kids Tee',
    basePriceNatur: 90,
    thumb: '/assets/market/tee.png',
    options: { size: ['XS', 'S', 'M', 'L'], material: ['Cotton', 'Organic'] },
  },
];

export default function MarketplaceHome() {
  return (
    <div className="container">
      <h1>Marketplace</h1>
      <p>Turn your Navatar into real-world goodies.</p>
      <div className="grid">
        {PRODUCTS.map((p) => (
          <Link key={p.sku} to={`/marketplace/customize/${p.sku}`} className="card">
            <img src={p.thumb} alt={p.title} />
            <div className="title">{p.title}</div>
            <div className="sub">{p.basePriceNatur} NATUR</div>
          </Link>
        ))}
      </div>
      <Link to="/marketplace/cart">View cart →</Link>
    </div>
  );
}

export { PRODUCTS };
