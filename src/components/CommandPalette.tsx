import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CATALOG, type LinkItem } from '../data/catalog';

type Props = { open: boolean; onClose: () => void };

function match(q: string, item: LinkItem) {
  const s = (item.title + ' ' + (item.subtitle ?? '') + ' ' + item.tags?.join(' ')).toLowerCase();
  return s.includes(q.toLowerCase());
}

export default function CommandPalette({ open, onClose }: Props) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 0); }, [open]);

  const results = useMemo(() => {
    if (!q) return CATALOG.slice(0, 8);
    return CATALOG.filter(i => match(q, i)).slice(0, 12);
  }, [q]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Command palette" className="nv-palette">
      <div className="nv-palette__box">
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search worlds, zones, marketplace…"
          aria-label="Search"
        />
        <ul>
          {results.map(r => (
            <li key={r.id}>
              <a href={r.href} onClick={onClose}>
                <span className="nv-pill">{r.kind}</span>
                <span className="nv-title">{r.title}</span>
                {r.subtitle && <span className="nv-sub">{r.subtitle}</span>}
              </a>
            </li>
          ))}
        </ul>
        <button className="nv-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </div>
  );
}
