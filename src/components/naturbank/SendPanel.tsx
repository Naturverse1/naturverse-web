import { useState } from 'react';
import { transferTo } from '../../lib/naturbank/demo';

export default function SendPanel({ onAfter }: { onAfter: () => void }) {
  const [to, setTo] = useState('');
  const [amt, setAmt] = useState<string>('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const amountNum = amt === '' ? NaN : Number(amt);
  const canSend = !!to.trim() && Number.isFinite(amountNum) && amountNum > 0 && !busy;

  async function onSend() {
    try {
      setBusy(true);
      transferTo(to.trim(), Number(amt), note.trim() || 'p2p demo');
      onAfter();
      alert('Sent (demo): debited your wallet.');
      setTo(''); setAmt(''); setNote('');
    } catch (e:any) {
      alert(e.message || 'Send failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>Send</h3>

      <label className="label">To</label>
      <input
        placeholder="Email or @handle"
        value={to}
        onChange={e=>setTo(e.target.value)}
      />

      <label className="label">Amount</label>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        placeholder="10"
        value={amt}
        onChange={e=>setAmt(e.target.value)}
      />

      <label className="label">Note (optional)</label>
      <input
        placeholder="p2p demo"
        value={note}
        onChange={e=>setNote(e.target.value)}
      />

      <div style={{ marginTop: 12 }}>
        <button disabled={!canSend} onClick={onSend}>Send</button>
      </div>
    </div>
  );
}
