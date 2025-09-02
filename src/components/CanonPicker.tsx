'use client';
import React, { useMemo, useState } from 'react';
import { CANON_NAVATARS } from '@/lib/canon';

export default function CanonPicker({ onPick }: { onPick: (url: string) => void }) {
  const [q, setQ] = useState('');
  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CANON_NAVATARS;
    return CANON_NAVATARS.filter(i =>
      i.label.toLowerCase().includes(s) || (i.tags || []).some(t => t.toLowerCase().includes(s))
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
            key={c.key}
            onClick={() => onPick(c.url)}
            className="group flex items-center gap-3 rounded-2xl border p-3 text-left hover:shadow-sm"
          >
            <img src={c.url} className="h-12 w-12 rounded-xl" alt={c.label} />
            <div className="min-w-0">
              <div className="truncate font-medium">{c.label}</div>
              {c.tags?.length ? (
                <div className="truncate text-xs text-gray-500">{c.tags.join(' · ')}</div>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

