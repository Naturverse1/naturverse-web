import React from 'react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import worldsData from '../../content/worlds';
import type { World } from '../../types/world';
import WorldCard from '../../components/WorldCard';

export default function Worlds() {
  const [params, setParams] = useSearchParams();
  const selected = params.get('world');
  const world = useMemo<World | undefined>(
    () => worldsData.find(w => w.slug === selected ?? ''),
    [selected]
  );

  const available = worldsData.filter(w => w.status === 'available');
  const locked = worldsData.filter(w => w.status === 'coming_soon');

  return (
    <main style={{ padding: 16, maxWidth: 1100, margin: '0 auto' }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Worlds</h1>
        <p style={{ margin: '6px 0 0', opacity: 0.8 }}>
          Explore the 14 kingdoms of the Naturverse™. Tap a card to preview details.
        </p>
      </header>

      <section style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Available</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12
          }}
        >
          {available.map(w => (
            <WorldCard key={w.slug} world={w} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Coming Soon</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12
          }}
        >
          {locked.map(w => (
            <WorldCard key={w.slug} world={w} />
          ))}
        </div>
      </section>

      {world && (
        <article
          aria-live="polite"
          style={{
            marginTop: 32,
            padding: 16,
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            background:
              'url(/assets/placeholders/world-bg.svg) center/cover no-repeat, #fff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <h2 style={{ margin: 0 }}>
              {world.name} <span style={{ opacity: 0.8, fontSize: 16 }}>{world.emoji ?? ''}</span>
            </h2>
            <button
              onClick={() => setParams({})}
              style={{
                border: '1px solid rgba(0,0,0,0.12)',
                background: '#fff',
                borderRadius: 8,
                padding: '6px 10px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>

          <p style={{ marginTop: 8, opacity: 0.9 }}>{world.tagline}</p>

          <div
            style={{
              marginTop: 10,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
              alignItems: 'start'
            }}
          >
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                minHeight: 160,
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              {world.image ? (
                <img
                  src={world.image}
                  alt={`${world.name} cover`}
                  style={{ width: '100%', display: 'block' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    height: 160,
                    background: 'url(/assets/placeholders/world-bg.svg) center/cover no-repeat'
                  }}
                >
                  <span style={{ fontSize: 14, opacity: 0.7 }}>Cover placeholder</span>
                </div>
              )}
            </div>

            <div>
              <h3 style={{ margin: '0 0 6px' }}>About</h3>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>
                  <strong>Region:</strong> {world.region}
                </li>
                <li>
                  <strong>Fruit:</strong> {world.fruit}
                </li>
                <li>
                  <strong>Animal:</strong> {world.animal}
                </li>
                <li>
                  <strong>Status:</strong>{' '}
                  {world.status === 'available' ? 'Available to explore' : 'Coming soon'}
                </li>
              </ul>

              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href="/Stories" style={btnStyle}>Stories</a>
                <a href="/Quizzes" style={btnStyle}>Quizzes</a>
                <a href="/Observations" style={btnStyle}>Observations</a>
                <a href="/Marketplace" style={btnStyle}>Marketplace</a>
              </div>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}

const btnStyle: React.CSSProperties = {
  display: 'inline-block',
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: 10,
  padding: '8px 12px',
  textDecoration: 'none'
};

