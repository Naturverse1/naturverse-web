import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { flags } from '@/lib/featureFlags';

export default function Kickstarter() {
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!flags.prelaunch) return null;

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!email || saving) return;
    setSaving(true);
    try {
      await supabase.from('waitlist').insert({ email, source: 'kickstarter' });
      setOk(true);
      setEmail('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 520, padding: '4rem 0' }}>
      <h1>Kickstarter Pre-Launch</h1>
      <p>Get notified when we go live and unlock more merch!</p>
      <form onSubmit={save} className="row gap" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          required
          style={{ flex: '1 1 220px', minWidth: 220, padding: '0.75rem', borderRadius: 12, border: '1px solid var(--nv-border)' }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ flex: '0 0 auto', padding: '0.75rem 1.5rem' }}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Notify me'}
        </button>
      </form>
      {ok && <p style={{ marginTop: '1rem', color: 'var(--nv-green-700)' }}>Thanks! You’re on the list.</p>}
    </main>
  );
}
