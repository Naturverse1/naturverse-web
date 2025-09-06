export default function CharacterCard({
  card,
  color = 'blue',
  onEdit,
}:{
  card?: any;
  color?: 'blue' | 'gray';
  onEdit?: () => void;
}) {
  return (
    <div className={`nv-card ${color === 'blue' ? 'nv-card-blue' : 'nv-card-gray'}`}>
      {card ? (
        <dl className="nv-list">
          {card.name && (
            <>
              <dt>Name</dt>
              <dd>{card.name}</dd>
            </>
          )}
          {card.species && (
            <>
              <dt>Species</dt>
              <dd>{card.species}</dd>
            </>
          )}
          {card.kingdom && (
            <>
              <dt>Kingdom</dt>
              <dd>{card.kingdom}</dd>
            </>
          )}
          {card.backstory && (
            <>
              <dt>Backstory</dt>
              <dd>{card.backstory}</dd>
            </>
          )}
          {card.powers && card.powers.length > 0 && (
            <>
              <dt>Powers</dt>
              <dd>{card.powers.map((p: string) => `— ${p}`).join('\n')}</dd>
            </>
          )}
          {card.traits && card.traits.length > 0 && (
            <>
              <dt>Traits</dt>
              <dd>{card.traits.map((t: string) => `— ${t}`).join('\n')}</dd>
            </>
          )}
        </dl>
      ) : (
        <p>No card yet.</p>
      )}
      {onEdit && (
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <button className="btn" onClick={onEdit}>
            {card ? 'Edit Card' : 'Create Card'}
          </button>
        </div>
      )}
    </div>
  );
}
