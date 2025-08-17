import React, { useEffect, useMemo, useState } from 'react';
import FilterBar, { Filters } from '../../components/marketplace/FilterBar';
import ProductCard from '../../components/marketplace/ProductCard';
import { applyFilters, DEFAULT_FILTERS, Item } from '../../lib/catalog';
import { toQuery, fromQuery } from '../../lib/urlState';
import { PRODUCTS } from '../../lib/products';

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

  return (
    <div className="page">
      <FilterBar filters={filters} categories={categories} onChange={setFilters} />
      {visibleItems.length ? (
        <div className="grid">
          {visibleItems.map(item => (
            <ProductCard key={item.id} item={item} />
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

