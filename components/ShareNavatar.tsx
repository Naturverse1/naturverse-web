import * as React from 'react';

type Card = {
  name?: string;
  species?: string;
  date?: string;
  imageUrl?: string;
  powers?: string[];
  backstory?: string;
};

function toToken(obj: any) {
  return encodeURIComponent(Buffer.from(JSON.stringify(obj)).toString('base64'));
}

export function ShareNavatar({ card }: { card: Card }) {
  const [busy, setBusy] = React.useState(false);

  async function handleShare() {
    try {
      setBusy(true);
      const token = toToken(card);
      const url = `${location.origin}/api/og/navatar?d=${token}`;
      if ((navigator as any).share) {
        await (navigator as any).share({ title: 'My Navatar', text: card.name || 'My Navatar', url });
      } else {
        // download fallback
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(card.name||'navatar').replace(/\s+/g,'_')}.png`;
        a.click();
      }
    } finally { setBusy(false); }
  }

  return (
    <button className="btn btn-primary" onClick={handleShare} disabled={busy}>
      {busy ? 'Preparing…' : 'Share card'}
    </button>
  );
}
