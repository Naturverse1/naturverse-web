import React, { useState } from 'react';

type Props = {
  onSend: (recipient: string, amount: number, note?: string) => Promise<void>;
};

export default function SendCard({ onSend }: Props) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(10);
  const [note, setNote] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await onSend(recipient, amount, note);
      setRecipient('');
      setNote('');
    } catch (err: any) {
      setError(err.message ?? 'Failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="card">
      <h3 className="h3">Send</h3>
      <form onSubmit={handleSubmit} className="col gap">
        <input
          className="inp"
          placeholder="Email or @handle"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
        />
        <input
          className="inp"
          type="number"
          min={1}
          value={amount}
          onChange={e => setAmount(parseInt(e.target.value, 10) || 0)}
          style={{ maxWidth: 100 }}
        />
        <input
          className="inp"
          placeholder="Note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" disabled={pending} type="submit">
          Send
        </button>
      </form>
    </section>
  );
}
