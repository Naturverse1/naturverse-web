import React, { useEffect, useMemo, useState } from 'react';
import FilterBar, { Filters } from '../../components/marketplace/FilterBar';
import ProductCard from '../../components/marketplace/ProductCard';
import { applyFilters, DEFAULT_FILTERS, Item } from '../../lib/catalog';
import { toQuery, fromQuery } from '../../lib/urlState';
import { PRODUCTS } from '../../lib/products';
import { useCart } from '../../context/CartContext';

const allItems: Item[] = PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  price: p.baseNatur,
  category: p.category,
  createdAt: p.createdAt,
  img: p.img,
}));

const categories = Array.from(new Set(allItems.map(i => i.category)));

export default function MarketplacePage() {
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem('natur_mp_filters') || '');
    } catch {
      return null;
    }
  })();
  const [filters, setFilters] = useState<Filters>(
    location.search ? fromQuery(location.search) : saved || DEFAULT_FILTERS,
  );

  useEffect(() => {
    localStorage.setItem('natur_mp_filters', JSON.stringify(filters));
    const q = toQuery(filters);
    window.history.replaceState(null, '', q);
  }, [filters]);

  const visibleItems = useMemo(() => applyFilters(allItems, filters), [filters]);
  const { add, openMiniCart } = useCart();

  const handleAdd = (item: Item) => {
    add({
      id: `${item.id}::XS::Cotton`,
      name: item.name,
      image: item.img,
      priceNatur: item.price,
      qty: 1,
      variant: { size: 'XS', material: 'Cotton' },
    });
    openMiniCart();
  };

  return (
    <div className="page">
      <FilterBar filters={filters} categories={categories} onChange={setFilters} />
      {visibleItems.length ? (
        <div className="grid">
          {visibleItems.map(item => (
            <div key={item.id} style={{ position: 'relative' }}>
              <ProductCard item={item} />
              <div style={{marginTop:'.5rem', display:'flex', gap:'.5rem'}}>
                <a href={`/marketplace/item?id=${item.id}`}>View</a>
                <button onClick={() => handleAdd(item)}>Add</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No results. Try clearing filters.</p>
          <button onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</button>
        </div>
      )}
    </div>
  );
}

