'use client';
import React, { useState } from 'react';
import type { Navatar } from '@/lib/navatar';
import { deleteAvatar, setPrimaryAvatar } from '@/lib/navatar';

export default function NavatarCard({ navatar, onChanged }: { navatar: Navatar; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this Navatar?')) return;
    setBusy(true);
    await deleteAvatar(navatar.id);
    setBusy(false);
    onChanged();
  }

  async function handlePrimary() {
    setBusy(true);
    await setPrimaryAvatar(navatar.id);
    setBusy(false);
    onChanged();
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border p-3">
      <img
        src={navatar.thumbnail_url || navatar.image_url || '/navatars/seedling.svg'}
        className="h-16 w-16 rounded-xl object-cover"
        alt={navatar.name || 'Navatar'}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-base font-semibold">{navatar.name || 'Untitled'}</h4>
          {navatar.is_primary ? (
            <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">Primary</span>
          ) : null}
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{navatar.method}</span>
          {navatar.status && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{navatar.status}</span>
          )}
        </div>
        {navatar.status_message && (
          <p className="truncate text-xs text-gray-500">{navatar.status_message}</p>
        )}
        <div className="mt-2 flex gap-2">
          {!navatar.is_primary && (
            <button
              onClick={handlePrimary}
              disabled={busy}
              className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white"
            >
              Set as primary
            </button>
          )}
          <button onClick={handleDelete} disabled={busy} className="rounded-lg bg-gray-100 px-3 py-1 text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

