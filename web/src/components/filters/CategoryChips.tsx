import React from 'react';

type Props = {
  categories: string[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export default function CategoryChips({ categories, selected, onChange }: Props) {
  const toggle = (cat: string) => {
    const set = new Set(selected);
    if (set.has(cat)) set.delete(cat); else set.add(cat);
    onChange(Array.from(set));
  };

  return (
    <div className="chip-row">
      {categories.map(cat => (
        <button
          key={cat}
          type="button"
          className="chip"
          aria-pressed={selected.includes(cat)}
          onClick={() => toggle(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
