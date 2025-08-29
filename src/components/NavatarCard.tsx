import React from 'react';
import { Navatar } from '../data/navatars';

type Props = {
  nav: Navatar;
  owned: boolean;
  activeId?: string | null;
  onGet?: (id: string) => void;
  onUse: (id: string) => void;
};

export default function NavatarCard({ nav, owned, activeId, onGet, onUse }: Props) {
  const isActive = activeId === nav.id;

  async function startCheckout(method: 'stripe' | 'natur') {
    const res = await fetch('/.netlify/functions/navatar-checkout', {
      method: 'POST',
      body: JSON.stringify({ user_id: (window as any).user?.id, navatar_id: nav.id, method }),
    });
    const data = await res.json();
    if (data.url) (window.location.href = data.url);
    else alert(data.message || 'Checkout started');
  }

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

        {owned ? (
          isActive ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a' }}>
              <span className={`navatar-frame ${nav.rarity}`}>
                <img src={nav.img} width={18} height={18} style={{ borderRadius: '50%' }} alt="" />
              </span>
              Active
            </div>
          ) : (
            <button onClick={() => onUse(nav.id)} style={{ padding: '8px 12px', borderRadius: 8 }}>
              Use
            </button>
          )
        ) : nav.priceCents > 0 ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => startCheckout('stripe')}
              style={{ padding: '8px 12px', borderRadius: 8 }}
            >
              Buy ${(nav.priceCents / 100).toFixed(2)}
            </button>
            <button
              onClick={() => startCheckout('natur')}
              style={{ padding: '8px 12px', borderRadius: 8 }}
            >
              Pay 100 $NATUR
            </button>
          </div>
        ) : (
          <button onClick={() => onGet && onGet(nav.id)} style={{ padding: '8px 12px', borderRadius: 8 }}>
            Get
          </button>
        )}
      </div>
    );
  }
