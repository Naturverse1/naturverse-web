import { useState } from 'react';

export default function ListNavatarModal({ navatarId, sellerUserId, onClose, onListed }:{
  navatarId: string; sellerUserId: string; onClose: ()=>void; onListed: ()=>void;
}) {
  const [currency, setCurrency] = useState<'usd'|'natur'>('usd');
  const [usd, setUsd] = useState<number>(4.99);
  const [natur, setNatur] = useState<number>(100);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const body: any = { seller_user_id: sellerUserId, navatar_id: navatarId, currency };
    if (currency === 'usd') body.price_cents = Math.round(usd * 100);
    else body.price_natur = natur;
    const r = await fetch('/.netlify/functions/listing-create', { method: 'POST', body: JSON.stringify(body) });
    setBusy(false);
    if (!r.ok) {
      alert(await r.text());
      return;
    }
    onListed();
    onClose();
  }

  return (
    <div className="modal">
      <div className="modal__card">
        <h3>List Navatar for sale</h3>
        <label>
          Currency:
          <select value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
            <option value="usd">USD (Stripe)</option>
            <option value="natur">$NATUR</option>
          </select>
        </label>
        {currency === 'usd' ? (
          <label>
            Price (USD):
            <input type="number" step="0.01" value={usd} onChange={(e) => setUsd(Number(e.target.value))} />
          </label>
        ) : (
          <label>
            Price ($NATUR):
            <input type="number" step="1" value={natur} onChange={(e) => setNatur(Number(e.target.value))} />
          </label>
        )}
        <div className="modal__actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submit} disabled={busy}>
            {busy ? 'Listing…' : 'List for sale'}
          </button>
        </div>
      </div>
      <style>{`
        .modal{position:fixed;inset:0;background:rgba(0,0,0,.4);display:grid;place-items:center;z-index:50}
        .modal__card{background:#fff;border-radius:12px;padding:16px;min-width:320px;max-width:420px}
        .modal__actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
      `}</style>
    </div>
  );
}
