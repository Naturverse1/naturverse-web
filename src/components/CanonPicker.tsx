'use client';
import React, { useMemo, useState } from 'react';
import CANONS, { type Canon } from '@/data/navatarCanons';

export default function CanonPicker({ onPick }: { onPick: (c: Canon) => void }) {
  const [q, setQ] = useState('');
  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CANONS;
    return CANONS.filter(i =>
      i.title.toLowerCase().includes(s) || i.tags.some(t => t.includes(s))
    );
  }, [q]);

  return (
    <div className="space-y-3">
      <input
        className="w-full rounded-lg border px-3 py-2"
        placeholder="Search canon (e.g., panda, plant, ocean)"
        value={q}
        onChange={(e)=>setQ(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c)}
            className="group flex items-center gap-3 rounded-2xl border p-3 text-left hover:shadow-sm"
          >
            <img src={c.url} className="h-12 w-12 rounded-xl" alt={c.title} />
            <div className="min-w-0">
              <div className="truncate font-medium">{c.title}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

