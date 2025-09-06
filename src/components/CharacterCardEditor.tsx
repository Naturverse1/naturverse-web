import { useState } from 'react';
import type { NavatarCard } from '../lib/avatars';
import '../styles/card.css';

type Props = {
  initial?: NavatarCard | null;
  onSave: (card: NavatarCard) => Promise<void>;
};

export default function CharacterCardEditor({ initial, onSave }: Props) {
  const [card, setCard] = useState<NavatarCard>(initial ?? {});
  const [saving, setSaving] = useState(false);

  const set = (k: keyof NavatarCard, v: any) =>
    setCard(prev => ({ ...prev, [k]: v }));

  const parseList = (s: string) =>
    s.split(',').map(x => x.trim()).filter(Boolean);

  return (
    <div className="card-editor">
      <div className="card-field">
        <label>Name</label>
        <input value={card.name ?? ''} onChange={e => set('name', e.target.value)} />
      </div>
      <div className="card-field">
        <label>Species / Type</label>
        <input value={card.species ?? ''} onChange={e => set('species', e.target.value)} />
      </div>
      <div className="card-field">
        <label>Alignment</label>
        <input value={card.alignment ?? ''} onChange={e => set('alignment', e.target.value)} />
      </div>
      <div className="card-field">
        <label>Backstory</label>
        <textarea value={card.backstory ?? ''} onChange={e => set('backstory', e.target.value)} />
      </div>
      <div className="card-field">
        <label>Powers (comma separated)</label>
        <input
          value={(card.powers ?? []).join(', ')}
          onChange={e => set('powers', parseList(e.target.value))}
        />
      </div>
      <div className="card-field">
        <label>Traits (comma separated)</label>
        <input
          value={(card.traits ?? []).join(', ')}
          onChange={e => set('traits', parseList(e.target.value))}
        />
      </div>

      <div className="card-actions">
        <button className="btn" disabled>
          AI: Suggest card (coming soon)
        </button>
        <button
          className="btn primary"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            try { await onSave(card); alert('Character card saved.'); }
            finally { setSaving(false); }
          }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
