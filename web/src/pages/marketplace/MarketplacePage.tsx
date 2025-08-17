import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../lib/products';

const MarketplacePage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {PRODUCTS.map(p => (
          <div key={p.id} className="border rounded-lg p-4 flex flex-col items-center">
            <img src={p.img} alt={p.name} className="w-32 h-32 object-contain mb-4" />
            <h2 className="font-semibold">{p.name}</h2>
            <p>{p.baseNatur} NATUR</p>
            <a href={`/marketplace/item?id=${p.id}`} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">
              Customize
            </a>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <Link to="/marketplace/cart" className="text-blue-500 underline">
          View Cart →
        </Link>
      </div>
    </div>
  );
};

export default MarketplacePage;

