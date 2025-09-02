'use client';
import React, { useEffect, useState } from 'react';
import { listNavatars } from '@/lib/navatar';
import type { Navatar } from '@/lib/navatar';
import NavatarCard from '@/components/NavatarCard';
import NavatarCreateModal from '@/components/NavatarCreateModal';
import { supabase } from '@/lib/navatar';

export default function NavatarPage() {
  const [navatars, setNavatars] = useState<Navatar[]>([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const rows = await listNavatars();
    setNavatars(rows);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // when auth state changes, reload list
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    return () => {
      sub.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">My Navatars</h1>
        <button onClick={() => setCreating(true)} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
          Create Navatar
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : navatars.length === 0 ? (
        <p className="text-gray-600">You don’t own any Navatars yet — create your first!</p>
      ) : (
        <div className="grid gap-3">
          {navatars.map((n) => (
            <NavatarCard key={n.id} navatar={n} onChanged={refresh} />
          ))}
        </div>
      )}

      <NavatarCreateModal open={creating} onClose={() => setCreating(false)} onCreated={refresh} />
    </div>
  );
}

