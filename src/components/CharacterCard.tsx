import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCharacterCard } from '../lib/navatar';
import { supabase } from '../lib/supabase-client';

export default function CharacterCard({ avatarId, color = 'blue' }: { avatarId: string; color?: 'blue' | 'gray' }) {
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    getCharacterCard(supabase, avatarId).then(setCard);
  }, [avatarId]);

  return (
    <section className={`card-shell ${color}`}>
      <h3>Character Card</h3>
      {card ? (
        <dl className="kv">
          <dt>Name</dt><dd>{card.name}</dd>
          <dt>Species</dt><dd>{card.base_type}</dd>
          <dt>Kingdom</dt><dd>{card.kingdom}</dd>
          <dt>Backstory</dt><dd>{card.backstory}</dd>
          <dt>Powers</dt><dd>{(card.powers ?? []).map((p: string) => `— ${p}`).join('\n')}</dd>
          <dt>Traits</dt><dd>{(card.traits ?? []).map((t: string) => `— ${t}`).join('\n')}</dd>
        </dl>
      ) : (
        <p>No card yet.</p>
      )}
      <Link to="/navatar/card" className="btn-secondary">Edit Card</Link>
    </section>
  );
}
