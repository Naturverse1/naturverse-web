import { useEffect, useState } from 'react';
import { getMyAvatar, Avatar } from '../../lib/supabaseAvatar';

export default function MyNavatar() {
  const [data, setData] = useState<Avatar | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setData(await getMyAvatar());
      } catch (e: any) {
        setErr(e.message ?? String(e));
      }
    })();
  }, []);

  const img = data?.image_url ?? '';
  const card = (data?.appearance_data && data.appearance_data._type === 'card')
    ? data.appearance_data
    : null;

  return (
    <main className="container">
      <h1 className="page">My Navatar</h1>

      <div className="actions">
        <a className="pill" href="/navatar/card">Card</a>
        <a className="pill" href="/navatar/pick">Pick</a>
        <a className="pill" href="/navatar/upload">Upload</a>
        <a className="pill" href="/navatar/mint">NFT / Mint</a>
        <a className="pill" href="/navatar/marketplace">Marketplace</a>
      </div>

      {err && <p className="error">{err}</p>}

      <div className="split">
        <div className="card big">
          {img ? <img src={img} alt={data?.name ?? 'My Navatar'} /> : <div className="empty">No photo</div>}
          <div className="label">{data?.name ?? '—'}</div>
        </div>

        <div className="panel">
          <h3>Character Card</h3>
          {card ? (
            <ul className="meta">
              <li><b>Name</b> {card.name ?? '—'}</li>
              <li><b>Species</b> {card.species ?? '—'}</li>
              <li><b>Kingdom</b> {card.kingdom ?? '—'}</li>
              <li><b>Backstory</b> {card.backstory ?? '—'}</li>
              <li><b>Powers</b> {(card.powers ?? []).join(', ') || '—'}</li>
              <li><b>Traits</b> {(card.traits ?? []).join(', ') || '—'}</li>
            </ul>
          ) : (
            <p>No card yet. <a href="/navatar/card">Create Card</a></p>
          )}
          <a className="btn" href="/navatar/card">Edit Card</a>
        </div>
      </div>
    </main>
  );
}
