import React from 'react';
import { Navatar } from '../data/navatars';
import { buyNavatarWithNatur } from '../lib/natur';

type Props = {
  nav: Navatar;
  owned: boolean;
  activeId?: string | null;
  onGet?: (id: string) => void;
  onUse: (id: string) => void;
};

export default function NavatarCard({ nav, owned, activeId, onGet, onUse }: Props) {
  const isActive = activeId === nav.id;

  async function startCheckout() {
    const res = await fetch('/.netlify/functions/navatar-checkout', {
      method: 'POST',
      body: JSON.stringify({ user_id: (window as any).user?.id, navatar_id: nav.id, method: 'stripe' }),
    });
    const data = await res.json();
    if (data.url) (window.location.href = data.url);
    else alert(data.message || 'Checkout started');
  }

  async function payNatur() {
    try {
      const amt = nav.priceNatur ?? 100;
      await buyNavatarWithNatur(nav.id, amt);
      alert('Purchased with $NATUR \u2713');
      onGet && onGet(nav.id);
    } catch (e: any) {
      alert(e?.message || 'Payment failed');
    }
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
              onClick={startCheckout}
              style={{ padding: '8px 12px', borderRadius: 8 }}
            >
              Buy ${(nav.priceCents / 100).toFixed(2)}
            </button>
            <button
              onClick={payNatur}
              style={{ padding: '8px 12px', borderRadius: 8 }}
            >
              Pay {nav.priceNatur ?? 100} $NATUR
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
