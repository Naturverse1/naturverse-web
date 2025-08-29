import React, { useEffect, useState } from 'react';
import { listAll, getOwned, own, getActive, setActive } from '../../lib/navatar';
import type { Navatar, Rarity } from '../../data/navatars';
import NavatarCard from '../../components/NavatarCard';
import { connectWallet } from '../../lib/web3';
import { Contract, parseUnits } from 'ethers';

type Listing = {
  id: string;
  navatar_id: string;
  currency: 'usd' | 'natur';
  price_cents?: number | null;
  price_natur?: number | null;
  seller_user_id: string;
  fee_bps?: number;
  royalty_bps?: number;
};

export default function NavatarMarketplacePage() {
  const [all, setAll] = useState<Navatar[]>([]);
  const [owned, setOwned] = useState<string[]>([]);
  const [active, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Rarity | 'all'>('all');
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    listAll().then(setAll);
    getOwned().then(setOwned);
    getActive().then(setActiveId);
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/navatar_listings?select=*`, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`,
      },
    })
      .then((r) => r.json())
      .then(setListings)
      .catch(() => setListings([]));
  }, []);

  const filtered = all.filter((a) => (filter === 'all' ? true : a.rarity === filter));

  async function onGet(id: string) {
    await own(id);
    setOwned(await getOwned());
  }

  async function onUse(id: string) {
    await setActive(id);
    setActiveId(await getActive());
  }

  async function buyStripe(listingId: string) {
    const buyer = (window as any).user?.id;
    if (!buyer) {
      alert('Sign in to buy');
      return;
    }
    const r = await fetch('/.netlify/functions/listing-buy-stripe', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId, buyer_user_id: buyer }),
    });
    const j = await r.json();
    if (j?.url) window.location.href = j.url;
    else alert('Failed to start checkout');
  }

  async function buyNatur(listingId: string, amountNatur: number) {
    const buyer = (window as any).user?.id;
    if (!buyer) {
      alert('Sign in to buy');
      return;
    }
    const rsp = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/navatar_listings?select=*,navatars(created_by)&id=eq.${listingId}`,
      {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`,
        },
      },
    );
    const [l] = await rsp.json();
    if (!l) return alert('Listing unavailable');
    const sellerRes = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?select=wallet_address&id=eq.${l.seller_user_id}`,
      {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`,
        },
      },
    );
    const [seller] = await sellerRes.json();
    const sellerWallet = seller?.wallet_address;
    if (!sellerWallet) return alert('Seller has no wallet set');

    const fee = Math.round(amountNatur * (l.fee_bps / 10000) * 1e6) / 1e6;
    const royalty = Math.round(amountNatur * (l.royalty_bps / 10000) * 1e6) / 1e6;
    const sellerAmt = Math.max(0, Math.round((amountNatur - fee - royalty) * 1e6) / 1e6);

    const { signer } = (await connectWallet()) as any;
    const token = new Contract(import.meta.env.VITE_NATUR_TOKEN_CONTRACT!, ['function transfer(address to, uint256 amount) returns (bool)'], signer);
    const dec = Number(import.meta.env.VITE_NATUR_TOKEN_DECIMALS || '18');

    const tx1 = await token.transfer(sellerWallet, parseUnits(String(sellerAmt), dec));
    const r1 = await tx1.wait();
    const tx2 = await token.transfer(import.meta.env.VITE_NATUR_TREASURY!, parseUnits(String(fee + royalty), dec));
    const r2 = await tx2.wait();

    const vr = await fetch('/.netlify/functions/listing-buy-natur-verify', {
      method: 'POST',
      body: JSON.stringify({ listing_id: listingId, buyer_user_id: buyer, tx_hashes: [r1?.hash || tx1.hash, r2?.hash || tx2.hash] }),
    });
    if (vr.ok) {
      alert('Purchased ✓');
      location.reload();
    } else {
      alert(await vr.text());
    }
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: 1100, margin: '0 auto' }}>
      <h1>Navatar Marketplace</h1>
      <p><a className="btn" href="/create/navatar">✨ Create your own</a></p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="all">All</option>
          <option value="starter">Starter</option>
          <option value="rare">Rare</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 240px)', gap: 16 }}>
        {filtered.map((n) => (
          <NavatarCard
            key={n.id}
            nav={n}
            owned={owned.includes(n.id)}
            activeId={active}
            onGet={onGet}
            onUse={onUse}
          />
        ))}
      </div>

      <h2 style={{ marginTop: 24 }}>Player Listings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 240px)', gap: 16 }}>
        {listings.map((l) => {
          const nav = all.find((n) => n.id === l.navatar_id);
          if (!nav) return null;
          return (
            <div key={l.id} className="card">
              <img src={nav.img} width={200} height={200} alt={nav.name} />
              <div style={{ fontWeight: 700 }}>{nav.name}</div>
              <div className="muted">
                {l.currency === 'usd'
                  ? `$ ${(l.price_cents! / 100).toFixed(2)}`
                  : `${l.price_natur} $NATUR`}
              </div>
              {l.currency === 'usd' ? (
                <button onClick={() => buyStripe(l.id)}>Buy with card</button>
              ) : (
                <button onClick={() => buyNatur(l.id, l.price_natur!)}>
                  Pay {l.price_natur} $NATUR
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
