import { useEffect, useState } from 'react';
import { supabase, listAvatars, setPrimaryAvatar, deleteAvatar } from '@/lib/navatar';
import CreateNavatarModal from '@/components/navatar/CreateNavatarModal';

export default function NavatarPage() {
  const [user, setUser] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(()=>{ (async()=>{
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) await refresh(user.id);
    setLoading(false);
  })(); }, []);

  async function refresh(uid:string){ const { data } = await listAvatars(uid); setList(data || []); }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold mb-3">My Navatars</h1>
        <p className="mb-6 text-neutral-600">Sign in to create your Navatar.</p>
        <a href="/signin" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white">Log in</a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">My Navatars</h1>
        <button onClick={()=>setOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Create Navatar</button>
      </div>

      {loading ? <p>Loading…</p> : list.length === 0 ? (
        <div className="rounded-xl border p-10 text-center text-neutral-600">No navatars yet — create your first!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(a=>(
            <div key={a.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <img src={a.image_url} alt={a.name} className="w-full aspect-square object-cover rounded-lg mb-3"/>
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-neutral-500 mb-3">{a.category} {a.is_primary ? '· Primary' : ''}</div>
              <div className="flex gap-2">
                {!a.is_primary && (
                  <button onClick={async()=>{ await setPrimaryAvatar(user.id, a.id, a.image_url); await refresh(user.id); }}
                          className="rounded bg-emerald-600 px-3 py-1.5 text-white">Set Primary</button>
                )}
                <button onClick={async()=>{ await deleteAvatar(user.id, a.id); await refresh(user.id); }}
                        className="rounded bg-neutral-100 px-3 py-1.5">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && <CreateNavatarModal user={user} onClose={()=>setOpen(false)} onCreated={()=>refresh(user.id)} />}
    </main>
  );
}
