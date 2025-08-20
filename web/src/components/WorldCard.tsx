import { useSearchParams } from 'react-router-dom';
import type { World } from '../types/world';

function gradientFor(slug: string): string {
  const colors = [
    ['#dbffea', '#8ee3b5'],
    ['#fff3d6', '#ffc48a'],
    ['#e8e7ff', '#c0baff'],
    ['#e6fbff', '#b9f1ff'],
    ['#ffe6ef', '#ffc2d9'],
    ['#f2ffe0', '#c8f57a'],
  ];
  const i = Math.abs([...slug].reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length;
  const [a, b] = colors[i];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

export default function WorldCard({ world }: { world: World }) {
  const [, setParams] = useSearchParams();
  const locked = world.status === 'coming_soon';
  const handleOpen = () => setParams({ world: world.slug });
  return (
    <button
      onClick={handleOpen}
      aria-label={world.name}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        textAlign: 'left',
        borderRadius: 12,
        padding: 12,
        background: gradientFor(world.slug),
        border: '1px solid rgba(0,0,0,0.07)',
        cursor: 'pointer'
      }}
    >
      <div style={{ fontWeight: 700 }}>{world.name}</div>
      <div style={{ opacity: 0.8, fontSize: 12 }}>{world.tagline}</div>
      <div style={{ fontSize: 18 }}>{world.emoji ?? ''}</div>
      {locked && (
        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600 }}>🔒 Coming soon</div>
      )}
    </button>
  );
}

