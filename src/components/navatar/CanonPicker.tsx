import React from 'react';
import { CANON_NAVATARS, CanonNavatar } from '@/data/canonNavatars';

type Props = { onPick: (nav: CanonNavatar) => void };

export default function CanonPicker({ onPick }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {CANON_NAVATARS.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onPick(c)}
          className="rounded-xl border bg-white p-2 hover:shadow transition text-center"
        >
          <img src={c.image} alt={c.name} className="w-full h-32 object-cover rounded" />
          <p className="mt-2 text-sm font-bold">{c.name}</p>
        </button>
      ))}
    </div>
  );
}
