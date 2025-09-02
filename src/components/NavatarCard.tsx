'use client';
import React from 'react';

export default function NavatarCard({
  navatar,
  onDelete,
}: {
  navatar: any;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border p-3 sm:p-4">
      <img
        src={navatar.image_url}
        alt={navatar.name}
        className="h-16 w-16 flex-none rounded-xl object-cover"
      />
      <div className="min-w-0">
        <div className="truncate font-semibold">{navatar.name || 'Untitled'}</div>
        <div className="text-sm text-gray-500">{navatar.method?.toUpperCase?.() || 'NAVATAR'}</div>
      </div>
      <div className="ml-auto">
        <button
          onClick={() => onDelete(navatar.id)}
          className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

