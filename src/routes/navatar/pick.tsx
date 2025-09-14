import { useState } from 'react';
import { pickStockAvatar } from '../../lib/supabaseAvatar';

const files = import.meta.glob('/public/navatars/photos/*.{png,jpg,jpeg,webp}', {
  eager: true,
  as: 'url'
});
const choices = Object.entries(files).map(([path, url]) => ({
  url: url as string,
  name: path.split('/').pop()?.replace(/\.(png|jpe?g|webp)$/i, '') || 'Navatar'
}));

export default function PickNavatar() {
  const [busy, setBusy] = useState(false);

  const onPick = async (url: string, name?: string) => {
    try {
      setBusy(true);
      await pickStockAvatar(url, name);
      alert('Picked!');
      location.assign('/navatar'); // go to My Navatar
    } catch (e: any) {
      alert(`Pick failed: ${e.message ?? e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container">
      <h1 className="page">Pick Navatar</h1>
      <div className="grid">
        {choices.map((c) => (
          <button key={c.url} className="card" disabled={busy} onClick={() => onPick(c.url, c.name)}>
            <img src={c.url} alt={c.name} />
            <div className="label">{c.name}</div>
          </button>
        ))}
      </div>
    </main>
  );
}
