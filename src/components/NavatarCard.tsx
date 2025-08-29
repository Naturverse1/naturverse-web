import React from 'react';
import { Navatar } from '../data/navatars';

type Props = {
  nav: Navatar;
  owned: boolean;
  activeId?: string | null;
  onGet: (id: string) => void;
  onUse: (id: string) => void;
};

export default function NavatarCard({ nav, owned, activeId, onGet, onUse }: Props) {
  const isActive = activeId === nav.id;

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        width: 240,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <img src={nav.img} alt={nav.name} width={200} height={200} style={{ alignSelf: 'center' }} />
      <div style={{ fontWeight: 700 }}>{nav.name}</div>
      <div style={{ display: 'flex', gap: 8, fontSize: 12, opacity: 0.8 }}>
        <span>{nav.rarity}</span>
        {nav.priceCents > 0 ? <span>${(nav.priceCents / 100).toFixed(2)}</span> : <span>Free</span>}
      </div>

      {!owned ? (
        <button onClick={() => onGet(nav.id)} style={{ padding: '8px 12px', borderRadius: 8 }}>
          {nav.priceCents ? 'Buy (soon)' : 'Get'}
        </button>
      ) : isActive ? (
        <div style={{ fontSize: 12, color: '#16a34a' }}>Active ✓</div>
      ) : (
        <button onClick={() => onUse(nav.id)} style={{ padding: '8px 12px', borderRadius: 8 }}>
          Use
        </button>
      )}
    </div>
  );
}
