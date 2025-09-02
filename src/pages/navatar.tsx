'use client';

import { useEffect, useState } from 'react';
import { supabase, listAvatars, setPrimaryAvatar, deleteAvatar } from '@/lib/navatar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import CreateNavatarModal from '@/components/navatar/CreateNavatarModal';

export default function NavatarPage(){
  const [user,setUser] = useState<any>(null);
  const [list,setList] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);
  const [open,setOpen] = useState(false);

  useEffect(()=>{ (async()=>{
    const { data:{ user } } = await supabase.auth.getUser();
    setUser(user); if (user) await refresh(user.id);
    setLoading(false);
  })(); }, []);

  async function refresh(uid:string){ const { data } = await listAvatars(uid); setList(data || []); }

  return (
    <ErrorBoundary>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-semibold mb-2">{user ? 'My Navatars' : 'Your Navatar'}</h1>

        {!user ? (
          <p className="text-neutral-600">You don’t own any Navatars yet. Visit the <a className="underline" href="/marketplace">Marketplace</a> to get one.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-neutral-600">{list.length ? 'Manage your Navatars below.' : 'No Navatars yet — create your first!'}</p>
              <button onClick={()=>setOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Create Navatar</button>
            </div>

            {loading ? <p>Loading…</p> : list.length === 0 ? (
              <div className="rounded-xl border p-10 text-center text-neutral-600">No Navatars yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map(a=>(
                  <div key={a.id} className="rounded-xl border bg-white p-4 shadow-sm">
                    <img src={a.image_url} alt={a.name} className="w-full aspect-square object-cover rounded-lg mb-3"/>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-neutral-500 mb-3">{a.category} {a.is_primary ? '· Primary' : ''}</div>
                    <div className="flex gap-2">
                      {!a.is_primary && (
                        <button onClick={async()=>{ await setPrimaryAvatar(user.id,a.id,a.image_url); await refresh(user.id); }}
                                className="rounded bg-emerald-600 px-3 py-1.5 text-white">Set Primary</button>
                      )}
                      <button onClick={async()=>{ await deleteAvatar(user.id,a.id); await refresh(user.id); }}
                              className="rounded bg-neutral-100 px-3 py-1.5">Delete</button>
                    </div>

                    {/* Web3 stubs (disabled now) */}
                    <div className="mt-3 flex gap-2 text-xs">
                      <button disabled className="rounded bg-neutral-100 px-2 py-1 opacity-50 cursor-not-allowed" title="Coming soon">Mint as NFT</button>
                      <button disabled className="rounded bg-neutral-100 px-2 py-1 opacity-50 cursor-not-allowed" title="Coming soon">Tip with NATUR</button>
                      <button disabled className="rounded bg-neutral-100 px-2 py-1 opacity-50 cursor-not-allowed" title="Coming soon">Order Merch</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {open && user && <CreateNavatarModal user={user} onClose={()=>setOpen(false)} onCreated={()=>refresh(user.id)} />}
      </main>
    </ErrorBoundary>
  );
}
