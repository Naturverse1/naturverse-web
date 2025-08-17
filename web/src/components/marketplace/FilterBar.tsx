import { useEffect, useState } from 'react';

export type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'newest';
export type Filters = {
  q: string;
  cats: string[];
  min?: number;
  max?: number;
  sort: SortKey;
};

export default function FilterBar({
  filters,
  onChange,
  categories,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  categories: string[];
}) {
  const [search, setSearch] = useState(filters.q);

  useEffect(() => {
    setSearch(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== filters.q) onChange({ ...filters, q: search });
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function toggleCat(cat: string) {
    const cats = filters.cats.includes(cat)
      ? filters.cats.filter(c => c !== cat)
      : [...filters.cats, cat];
    onChange({ ...filters, cats });
  }

  return (
    <div className="filters">
      <input
        type="search"
        placeholder="Search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div>
        {categories.map(cat => (
          <span
            key={cat}
            className={`pill ${filters.cats.includes(cat) ? 'active' : ''}`}
            onClick={() => toggleCat(cat)}
          >
            {cat}
          </span>
        ))}
      </div>
      <div>
        <input
          type="number"
          placeholder="Min"
          value={filters.min ?? ''}
          onChange={e =>
            onChange({
              ...filters,
              min: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <input
          type="number"
          placeholder="Max"
          value={filters.max ?? ''}
          onChange={e =>
            onChange({
              ...filters,
              max: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>
      <select
        value={filters.sort}
        onChange={e =>
          onChange({ ...filters, sort: e.target.value as SortKey })
        }
      >
        <option value="relevance">Relevance</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
        <option value="newest">Newest</option>
      </select>
      <button
        onClick={() =>
          onChange({ q: '', cats: [], min: undefined, max: undefined, sort: 'relevance' })
        }
      >
        Clear filters
      </button>
    </div>
  );
}

