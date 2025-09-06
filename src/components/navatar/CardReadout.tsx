import React from 'react';
import { CardFrame } from './CardFrame';
import type { UserCard } from '@/lib/supabase/navatar';

export function CardReadout({ card }: { card: UserCard | null }) {
  return (
    <CardFrame title={card?.name || 'Character Card'}>
      {card ? (
        <div className="nv-card-body">
          <dl>
            {card.species && (
              <>
                <dt className="nv-label">Species</dt>
                <dd>{card.species}</dd>
              </>
            )}
            {card.kingdom && (
              <>
                <dt className="nv-label">Kingdom</dt>
                <dd>{card.kingdom}</dd>
              </>
            )}
            {card.backstory && (
              <>
                <dt className="nv-label">Backstory</dt>
                <dd>{card.backstory}</dd>
              </>
            )}
            {card.powers && card.powers.length > 0 && (
              <>
                <dt className="nv-label">Powers</dt>
                <dd>{card.powers.join(', ')}</dd>
              </>
            )}
            {card.traits && card.traits.length > 0 && (
              <>
                <dt className="nv-label">Traits</dt>
                <dd>{card.traits.join(', ')}</dd>
              </>
            )}
          </dl>
        </div>
      ) : (
        <div className="nv-card-body">
          <p>No card yet.</p>
        </div>
      )}
    </CardFrame>
  );
}

