import { useState } from 'react';
import { publicUrl } from '../../shared/supabase/storage';

interface Props {
  path: string;
  name: string;
  onSelect: (p: string, n: string) => void;
  selected?: boolean;
}

export function NavatarTile({ path, name, onSelect, selected }: Props) {
  const [loaded, setLoaded] = useState(false);
  const url = publicUrl(path);
  return (
    <button
      className={`group relative w-full text-left rounded-xl border bg-white p-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${selected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(path, name)}
    >
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
        {!loaded && <div className="h-full w-full animate-pulse bg-gray-200" />}
        <img
          src={url}
          alt={name}
          loading="lazy"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          className={`h-full w-full object-cover transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="mt-2 line-clamp-1 text-center text-sm font-semibold text-blue-700">{name}</div>
    </button>
  );
}
