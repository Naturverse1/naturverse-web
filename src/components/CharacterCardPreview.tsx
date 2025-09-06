import '../styles/card.css';
import type { NavatarCard } from '../lib/avatars';

export default function CharacterCardPreview({ card }: { card?: NavatarCard | null }) {
  return (
    <div className="navatar-card">
      <div style={{ padding: '1rem 1rem .75rem' }}>
        <h3 style={{ margin: 0 }}>{card?.name || 'My Navatar'}</h3>
        <div style={{ color: '#6b7280', marginTop: 4 }}>
          {[card?.species, card?.alignment].filter(Boolean).join(' • ') || '—'}
        </div>
      </div>
      <div style={{ padding: '0 1rem 1rem' }}>
        <strong>Backstory</strong>
        <p style={{ marginTop: 6 }}>
          {card?.backstory || 'No backstory yet.'}
        </p>
        <strong>Powers</strong>
        <ul style={{ marginTop: 6 }}>
          {(card?.powers?.length ? card.powers : ['—']).map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <strong>Traits</strong>
        <p style={{ marginTop: 6 }}>
          {card?.traits?.join(', ') || '—'}
        </p>
      </div>
    </div>
  );
}
