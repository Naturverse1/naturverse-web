import type { NextApiRequest } from 'next';
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

function fromToken(t?: string) {
  try {
    if (!t) return {};
    const json = Buffer.from(decodeURIComponent(t), 'base64').toString('utf8');
    return JSON.parse(json);
  } catch { return {}; }
}

export default async function handler(req: NextApiRequest) {
  const { searchParams } = new URL(req.url!);
  const data = fromToken(searchParams.get('d'));

  const name = data.name ?? 'Navatar';
  const species = data.species ?? '';
  const date = data.date ?? '';
  const powers = Array.isArray(data.powers) ? data.powers.join(' · ') : '';
  const backstory = (data.backstory ?? '').slice(0, 240);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630,
          display: 'flex', flexDirection: 'row', gap: 32,
          background: '#f4f8ff', padding: 48,
          fontFamily: 'ui-sans-serif, system-ui',
          color: '#1b50d8'
        }}
      >
        <div style={{
          width: 360, height: 360, background: 'white', borderRadius: 24,
          boxShadow: '0 12px 40px rgba(0,0,0,.12)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {/* If you have an imageUrl, render it; else a placeholder */}
          {data.imageUrl
            ? <img src={data.imageUrl} width={360} height={360} style={{ objectFit:'cover', borderRadius: 24 }} />
            : <div style={{fontSize: 120}}>🧿</div>}
        </div>
        <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
          <div style={{ fontSize: 64, fontWeight: 800 }}>{name}</div>
          <div style={{ fontSize: 28, marginTop: 8 }}>{species} • {date}</div>
          {powers && <div style={{ fontSize: 28, marginTop: 16 }}>{powers}</div>}
          {backstory && (
            <div style={{
              marginTop: 24, fontSize: 28, lineHeight: 1.35,
              color: '#133fb0', maxWidth: 740
            }}>{backstory}</div>
          )}
          <div style={{ marginTop: 'auto', fontSize: 24, opacity: .6 }}>thenaturverse.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
