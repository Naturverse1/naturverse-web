import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getNavatars, Navatar } from '@/lib/navatar';
import NavatarCard from '@/components/navatar/NavatarCard';
import NavatarForm from '@/components/navatar/NavatarForm';

export default function NavatarPage() {
  const { user } = useAuth();
  const [avatars, setAvatars] = useState<Navatar[]>([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Navatar | null>(null);

  useEffect(() => {
    if (user) {
      getNavatars(user.id).then(setAvatars);
    }
  }, [user]);

  const refresh = () => {
    if (user) getNavatars(user.id).then(setAvatars);
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>
          Please <a href="/login" className="text-blue-600">Create account / Log in</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Navatars</h1>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => setCreating(true)}
        >
          Create Navatar
        </button>
      </div>
      {avatars.length === 0 ? (
        <div className="rounded-xl border bg-white p-4 text-center">No navatars yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {avatars.map((av) => (
            <NavatarCard key={av.id} avatar={av} onEdit={(a) => setEditing(a)} refresh={refresh} />
          ))}
        </div>
      )}
      {creating && (
        <NavatarForm
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            refresh();
          }}
        />
      )}
      {editing && (
        <NavatarForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
