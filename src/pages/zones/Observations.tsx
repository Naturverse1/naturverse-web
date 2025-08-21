import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import PhotoUploader from '../../components/PhotoUploader';
import { Observation } from '../../lib/observations/types';
import {
  addObservation,
  exportObservations,
  importObservations,
  loadObservations,
  removeObservation,
  saveObservations,
} from '../../lib/observations/store';

const uid = () => Math.random().toString(36).slice(2, 10);

// Resize to thumbnail & get dominant color (quick & local)
async function toThumbAndColor(file: File, size = 320): Promise<{ thumb: string; color: string; src: string }> {
  const img = document.createElement('img');
  const src = URL.createObjectURL(file);
  img.src = src;
  await img.decode();

  const scale = size / Math.max(img.width, img.height);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const cnv = document.createElement('canvas');
  cnv.width = w;
  cnv.height = h;
  const ctx = cnv.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  const thumb = cnv.toDataURL('image/jpeg', 0.8);

  const data = ctx.getImageData(0, 0, w, h).data;
  let r = 0,
    g = 0,
    b = 0,
    n = 0;
  const step = 8 * 4; // sample every 8px
  for (let i = 0; i < data.length; i += step) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  r = Math.round(r / n);
  g = Math.round(g / n);
  b = Math.round(b / n);
  const color = `#${[r, g, b]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')}`;

  const reader = new FileReader();
  const fullData: string = await new Promise((res) => {
    reader.onload = () => res(reader.result as string);
    reader.readAsDataURL(file);
  });

  URL.revokeObjectURL(src);
  return { thumb, color, src: fullData };
}

function suggestTags(hex: string): string[] {
  // naive color → tags
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const tags: string[] = ['nature'];
  if (g > r && g > b) tags.push('greenery');
  if (b > 140 && r < 120) tags.push('water/sky');
  if (r > 180 && g > 140) tags.push('flower');
  if (r > 150 && g < 120) tags.push('sunset/rock');
  return tags;
}

export default function Observations() {
  const [tab, setTab] = useState<'upload' | 'gallery' | 'tools' | 'coming'>('upload');
  const [list, setList] = useState<Observation[]>([]);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Observation | null>(null);
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    setList(loadObservations());
  }, []);
  useEffect(() => {
    saveObservations(list);
  }, [list]);

  const addFiles = async (files: File[]) => {
    setBusy(true);
    // optional: geo
    let lat: number | undefined,
      lon: number | undefined;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation?.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
          timeout: 3000,
        }),
      );
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    } catch {}
    for (const f of files) {
      const { thumb, color, src } = await toThumbAndColor(f);
      const obs: Observation = {
        id: uid(),
        title: f.name.replace(/\.[^.]+$/, ''),
        notes: '',
        tags: suggestTags(color),
        takenAt: new Date().toISOString(),
        lat,
        lon,
        color,
        src,
        thumb,
      };
      addObservation(obs);
      setList((prev) => [obs, ...prev]);
      setEarned((e) => e + 1); // 1 demo coin per upload
    }
    setBusy(false);
    setTab('gallery');
  };

  const updateSelected = (patch: Partial<Observation>) => {
    if (!selected) return;
    const next = { ...selected, ...patch };
    setSelected(next);
    setList(list.map((o) => (o.id === next.id ? next : o)));
  };

  const remove = (id: string) => {
    removeObservation(id);
    setList(list.filter((o) => o.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const byTag = useMemo(() => {
    const m = new Map<string, number>();
    for (const o of list) for (const t of o.tags) m.set(t, (m.get(t) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [list]);

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Home', to: '/' },
        { label: 'Zones', to: '/zones' },
        { label: 'Observations' }
      ]} />
      <h1>📷🌿 Observations</h1>
      <p>Upload nature pics; tag, learn, earn. (Local & offline; data stays in your browser.)</p>

      <div className="stats-row">
        <span className="badge">Photos: {list.length}</span>
        <span className="badge">Leaves (demo): {earned}</span>
      </div>

      <div className="tabs" role="tablist" aria-label="Observations">
        <button className="tab" aria-selected={tab === 'upload'} onClick={() => setTab('upload')}>
          Upload
        </button>
        <button className="tab" aria-selected={tab === 'gallery'} onClick={() => setTab('gallery')}>
          Gallery
        </button>
        <button className="tab" aria-selected={tab === 'tools'} onClick={() => setTab('tools')}>
          Tools
        </button>
        <button className="tab" aria-selected={tab === 'coming'} onClick={() => setTab('coming')}>
          Coming Soon
        </button>
      </div>

      {tab === 'upload' && (
        <section className="uploader-wrap">
          <PhotoUploader onFiles={addFiles} label="Upload nature photos" />
          <p className="meta">Tip: grant location to embed approximate GPS (for quests later).</p>
          {busy && <p className="meta">Processing…</p>}
        </section>
      )}

      {tab === 'gallery' && (
        <section>
          <div className="flex-split">
            <div className="gallery-grid">
              {list.map((o) => (
                <button
                  key={o.id}
                  className="obs-card"
                  onClick={() => setSelected(o)}
                  aria-label={`Open ${o.title}`}
                >
                  <img src={o.thumb} alt={o.title} />
                  <div className="obs-info">
                    <div className="obs-title">{o.title}</div>
                    <div className="tag-row">
                      {o.tags.slice(0, 3).map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="swatch" style={{ background: o.color }} aria-hidden />
                </button>
              ))}
              {list.length === 0 && <p className="meta">No photos yet. Try the Upload tab.</p>}
            </div>

            {selected && (
              <aside className="obs-panel">
                <img src={selected.src} alt={selected.title} className="obs-full" />
                <div className="form-row">
                  <input
                    className="input"
                    value={selected.title}
                    onChange={(e) => updateSelected({ title: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <textarea
                    className="textarea"
                    placeholder="Notes"
                    value={selected.notes || ''}
                    onChange={(e) => updateSelected({ notes: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <input
                    className="input"
                    placeholder="Add tag (press Enter)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const v = (e.target as HTMLInputElement).value.trim();
                        if (!v) return;
                        updateSelected({
                          tags: Array.from(new Set([...(selected.tags || []), v])),
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
                <div className="tag-row">
                  {(selected.tags || []).map((t) => (
                    <button
                      key={t}
                      className="tag removable"
                      onClick={() => {
                        updateSelected({ tags: (selected.tags || []).filter((x) => x !== t) });
                      }}
                    >
                      {t} ×
                    </button>
                  ))}
                </div>
                <div className="meta">
                  {selected.takenAt && <>Taken: {new Date(selected.takenAt).toLocaleString()} · </>}
                  {selected.lat && selected.lon && (
                    <>Loc: {selected.lat.toFixed(3)}, {selected.lon.toFixed(3)}</>
                  )}
                </div>
                <div className="actions">
                  <button className="btn outline" onClick={() => setSelected(null)}>
                    Close
                  </button>
                  <button className="btn danger" onClick={() => remove(selected.id)}>
                    Delete
                  </button>
                </div>
              </aside>
            )}
          </div>

          <div className="tag-cloud">
            {byTag.map(([t, n]) => (
              <span key={t} className="tag big">
                {t} ({n})
              </span>
            ))}
          </div>
        </section>
      )}

      {tab === 'tools' && (
        <section>
          <h2>Data Tools</h2>
          <div className="actions">
            <button
              className="btn"
              onClick={() => {
                const blob = new Blob([exportObservations()], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'observations.json';
                a.click();
              }}
            >
              Export JSON
            </button>

            <label className="btn outline" role="button">
              Import JSON
              <input
                type="file"
                accept="application/json"
                hidden
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const txt = await f.text();
                  importObservations(txt);
                  setList(loadObservations());
                }}
              />
            </label>

            <button
              className="btn outline"
              onClick={() => {
                if (confirm('Clear all local observations?')) {
                  saveObservations([]);
                  setList([]);
                  setSelected(null);
                }
              }}
            >
              Clear
            </button>
          </div>
          <p className="meta">All data is stored locally in your browser (no sign-in required).</p>
        </section>
      )}

      {tab === 'coming' && (
        <section>
          <h2>Coming Soon</h2>
          <ul>
            <li>Geo-quests & challenges across the 14 kingdoms.</li>
            <li>Species ID helper & teacher review via Naturversity.</li>
            <li>Earnable badges, XP, and NATUR coin.</li>
          </ul>
        </section>
      )}
    </div>
  );
}
