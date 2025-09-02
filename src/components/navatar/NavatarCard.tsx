import React from 'react';
import { Navatar, setPrimaryAvatar, deleteNavatar } from '@/lib/navatar';
import { useAuth } from '@/lib/auth-context';

interface Props {
  avatar: Navatar;
  onEdit: (av: Navatar) => void;
  refresh: () => void;
}

export default function NavatarCard({ avatar, onEdit, refresh }: Props) {
  const { user } = useAuth();
  const { id, name, category, image_url, is_primary } = avatar;

  const handlePrimary = async () => {
    if (!user) return;
    await setPrimaryAvatar(user.id, id, image_url);
    refresh();
  };

  const handleDelete = async () => {
    await deleteNavatar(id);
    refresh();
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow transition">
      <img src={image_url} alt={name} className="w-full h-48 object-cover rounded-md" />
      <h3 className="mt-2 font-bold">{name}</h3>
      <p className="text-sm text-gray-500">{category}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          onClick={handlePrimary}
          className="px-2 py-1 rounded bg-blue-600 text-white text-sm"
        >
          {is_primary ? 'Primary' : 'Set Primary'}
        </button>
        <button
          onClick={() => onEdit(avatar)}
          className="px-2 py-1 rounded bg-gray-200 text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 rounded bg-red-500 text-white text-sm"
        >
          Delete
        </button>
        <button
          disabled
          title="Coming soon"
          className="px-2 py-1 rounded bg-gray-200 text-sm opacity-50 cursor-not-allowed"
        >
          Mint as NFT
        </button>
        <button
          disabled
          title="Coming soon"
          className="px-2 py-1 rounded bg-gray-200 text-sm opacity-50 cursor-not-allowed"
        >
          Tip/Boost with NATUR
        </button>
        <button
          disabled
          title="Coming soon"
          className="px-2 py-1 rounded bg-gray-200 text-sm opacity-50 cursor-not-allowed"
        >
          Order Plushie/T-Shirt
        </button>
      </div>
    </div>
  );
}
