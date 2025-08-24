import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Props = {
  world: string;
  className?: string;
};

type Item = {
  name: string;
  url: string;
};

const isCharacterImage = (name: string) => {
  const lower = name.toLowerCase();
  if (lower === '.keep') return false;
  if (lower.endsWith('.json')) return false;
  if (lower.includes('map')) return false;
  return (
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.webp')
  );
};

export function CharacterGrid({ world, className }: Props) {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const folder = `kingdoms/${world}`;
      const { data, error } = await supabase.storage.from('public').list(folder, { limit: 100 });
      if (error) {
        console.error('CharacterGrid:list', error);
        if (mounted) setItems([]);
        return;
      }

      const filtered = (data ?? []).filter((f) => isCharacterImage(f.name));
      const withUrls: Item[] = filtered.map((f) => {
        const path = `${folder}/${f.name}`;
        const { data: urlData } = supabase.storage.from('public').getPublicUrl(path);
        const label = f.name
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const nice = label.charAt(0).toUpperCase() + label.slice(1);
        return { name: nice, url: urlData.publicUrl };
      });

      if (mounted) setItems(withUrls);
    })();
    return () => {
      mounted = false;
    };
  }, [world]);

  if (!items) {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className ?? ''}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-2 animate-pulse">
            <div className="aspect-[3/4] rounded-lg bg-slate-100" />
            <div className="h-4 mt-2 w-2/3 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${className ?? ''}`}>
      {items.map((it) => (
        <figure key={it.url} className="rounded-xl border border-slate-200 p-2 bg-white">
          <div className="aspect-[3/4] overflow-hidden rounded-md">
            <img src={it.url} alt={it.name} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <figcaption className="mt-2 text-sm font-medium text-slate-800">{it.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
