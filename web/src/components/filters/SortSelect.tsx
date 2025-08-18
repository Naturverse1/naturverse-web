import React from 'react';
import type { Sort } from '../../lib/catalogFilter';

type Props = {
  value: Sort;
  onChange: (v: Sort) => void;
};

export default function SortSelect({ value, onChange }: Props) {
  return (
    <select className="sort-select" value={value} onChange={e => onChange(e.target.value as Sort)}>
      <option value="relevance">Relevance</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="newest">Newest</option>
    </select>
  );
}
