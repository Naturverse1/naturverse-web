import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { listPaged } from '../../../shared/supabase/storage';
import { NavatarTile } from '../../../components/navatar/NavatarTile';
import { selectNavatar } from '../../../shared/navatar/api';
import { LRU } from '../../../shared/cache/lru';
import { useToast } from '../../../components/Toast';
import type { PickEntry } from './NavatarPick.types';

const cache = new LRU<string, { data: any[]; ts: number }>(6);
const PAGE_SIZE = 20;
const PREFIX = 'navatars';
const STALE_MS = 5 * 60 * 1000;

export default function PickNavatar() {
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const toast = useToast();
  const page = Math.max(1, parseInt(sp.get('page') || '1', 10));
  const key = `${PREFIX}:${page}`;
  const cached = cache.get(key);
  const stale = cached && Date.now() - cached.ts > STALE_MS;
  const [rows, setRows] = useState<any[] | null>(cached ? cached.data : null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!cached || stale) {
      if (!cached) setLoading(true);
      listPaged(PREFIX, page, PAGE_SIZE)
        .then(data => { if (cancelled) return; cache.set(key, { data, ts: Date.now() }); setRows(data); })
        .catch(e => { if (cancelled) return; setError(e.message || 'Failed to load'); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }
    return () => { cancelled = true; };
  }, [page]);

  const tiles = useMemo<PickEntry[]>(() => (rows ?? []).map((f: any) => ({
    path: `${PREFIX}/${f.name}`,
    name: f.name,
  })), [rows]);

  async function handleSelect(path: string, name: string) {
    setSelected(path);
    try {
      await selectNavatar(path, name);
      toast({ text: `Selected ${name}`, kind: 'ok' });
      nav('/navatar');
    } catch (e: any) {
      setSelected(null);
      toast({ text: e.message || 'Could not select', kind: 'err' });
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4">
      <h1 className="mb-3 text-center text-3xl font-bold">Pick Navatar</h1>
      <p className="mb-6 cursor-pointer text-center text-sm text-blue-600" onClick={() => nav('/navatar')}>← Back to My Navatar</p>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error} <button className="ml-3 underline" onClick={() => { setRows(null); setError(null); }}>Retry</button>
        </div>
      )}

      {(!loading && rows && rows.length === 0) ? (
        <div className="text-center text-sm text-gray-600">
          No navatars yet — <button className="underline" onClick={() => nav('/navatar/upload')}>upload yours</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {(loading ? Array.from({ length: 8 }) : tiles).map((t: any, i: number) =>
            loading ? (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-gray-200" />
            ) : (
              <NavatarTile key={t.path} path={t.path} name={t.name} onSelect={handleSelect} selected={selected === t.path} />
            )
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          className="rounded-full border px-4 py-2 text-sm disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => setSp({ page: String(page - 1) }, { replace: false })}
        >Previous</button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button
          className="rounded-full border px-4 py-2 text-sm"
          onClick={() => setSp({ page: String(page + 1) }, { replace: false })}
        >Next</button>
      </div>
    </div>
  );
}
