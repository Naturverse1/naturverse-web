'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { listNavatars, deleteAvatar, getUserId } from '@/lib/navatar-client';
import NavatarCreateModal from '@/components/NavatarCreateModal';

export default function NavatarPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const id = await getUserId();
      setUid(id);
      if (id) {
        const rows = await listNavatars();
        setItems(rows);
      } else {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-center text-3xl font-extrabold">Your Navatar</h1>

      {uid ? (
        <div className="mb-6 text-center">
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:opacity-95"
          >
            Create Navatar
          </button>
        </div>
      ) : (
        <p className="mb-8 text-center text-gray-600">Sign in to create and manage your Navatars.</p>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-600">No Navatars yet — create your first!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.id} className="rounded-2xl border p-3">
              <img src={it.image_url} alt={it.name} className="mb-3 h-48 w-full rounded-xl object-cover" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.name || 'Untitled'}</div>
                  <div className="text-xs text-gray-500">{(it.method || 'navatar').toUpperCase()}</div>
                </div>
                <button
                  onClick={async ()=>{ await deleteAvatar(it.id); await refresh(); }}
                  className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <NavatarCreateModal open={open} onClose={()=>setOpen(false)} onCreated={refresh} />
    </div>
  );
}

