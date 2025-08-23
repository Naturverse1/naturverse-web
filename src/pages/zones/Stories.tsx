import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Story } from '../../lib/story/types';
import { SAMPLE_STORIES } from '../../lib/story/sampleStories';
import { StoryPlayer, Progress } from '../../components/StoryPlayer';
import '../../styles/zone-widgets.css';

const STORAGE_STORIES = 'naturverse.stories.custom';
const STORAGE_PROGRESS = 'naturverse.stories.progress';

function loadCustom(): Story[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_STORIES) || '[]');
  } catch {
    return [];
  }
}
function saveCustom(list: Story[]) {
  try {
    localStorage.setItem(STORAGE_STORIES, JSON.stringify(list));
  } catch {}
}
function loadProgress(): Record<string, Progress> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PROGRESS) || '{}');
  } catch {
    return {};
  }
}
function saveProgress(map: Record<string, Progress>) {
  try {
    localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(map));
  } catch {}
}
const uid = () => Math.random().toString(36).slice(2, 9);

export default function Stories() {
  const [tab, setTab] = useState<'play' | 'create' | 'library' | 'coming'>('play');
  const [custom, setCustom] = useState<Story[]>(loadCustom());
  const stories = useMemo(() => [...SAMPLE_STORIES, ...custom], [custom]);

  const [activeId, setActiveId] = useState<string>(stories[0]?.id || '');
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>(loadProgress());

  useEffect(() => saveProgress(progressMap), [progressMap]);

  const active = stories.find((s) => s.id === activeId) || stories[0];
  const progress = progressMap[active.id] || { storyId: active.id, at: active.start, history: [] };

  const onProg = (p: Progress) => setProgressMap((prev) => ({ ...prev, [p.storyId]: p }));

  // Creator form state
  const [title, setTitle] = useState('');
  const [realm, setRealm] = useState('');
  const [emoji, setEmoji] = useState('📚');
  const [scenes, setScenes] = useState<{ id: string; title: string; body: string }[]>([
    { id: 'start', title: 'Beginning', body: 'Your journey begins...' },
  ]);
  const [links, setLinks] = useState<{ from: string; text: string; to: string }[]>([]);

  const addScene = () => setScenes((s) => [...s, { id: uid(), title: 'New Scene', body: '' }]);
  const addChoice = (from: string) =>
    setLinks((v) => [...v, { from, text: 'Continue', to: 'start' }]);
  const saveStory = () => {
    const story: Story = {
      id: `local-${uid()}`,
      title: title || 'Untitled',
      realm: realm || 'Any',
      emoji,
      start: scenes[0].id,
      scenes: scenes.map((s) => ({
        id: s.id,
        title: s.title,
        body: s.body,
        choices: links
          .filter((l) => l.from === s.id)
          .map((l, i) => ({ id: `${s.id}-${i}`, text: l.text, goto: l.to })),
      })),
    };
    const next = [story, ...custom];
    setCustom(next);
    saveCustom(next);
    setTab('library');
    setActiveId(story.id);
  };

  return (
    <main id="main">
      <Breadcrumbs />
      <h1>📚✨ Stories</h1>
      <p>AI story paths set in all 14 kingdoms (local, no-backend version).</p>

      <div className="tabs" role="tablist" aria-label="Stories">
        <button className="tab" aria-selected={tab === 'play'} onClick={() => setTab('play')}>
          Play
        </button>
        <button className="tab" aria-selected={tab === 'create'} onClick={() => setTab('create')}>
          Create
        </button>
        <button className="tab" aria-selected={tab === 'library'} onClick={() => setTab('library')}>
          Library
        </button>
        <button className="tab" aria-selected={tab === 'coming'} onClick={() => setTab('coming')}>
          Coming Soon
        </button>
      </div>

      {tab === 'play' && active && (
        <section className="creator-grid">
          <div>
            <h2>Pick a story</h2>
            <div className="list-grid">
              {stories.map((s) => (
                <button
                  key={s.id}
                  className="card-mini"
                  onClick={() => setActiveId(s.id)}
                  style={{
                    textAlign: 'left',
                    border: s.id === activeId ? '2px solid var(--nv-text)' : undefined,
                  }}
                >
                  <div style={{ fontSize: 22 }}>{s.emoji || '📖'}</div>
                  <div style={{ fontWeight: 700 }}>{s.title}</div>
                  <div className="meta">{s.realm}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2>Play</h2>
            <StoryPlayer story={active} progress={progress} onProgress={onProg} />
          </div>
        </section>
      )}

      {tab === 'create' && (
        <section>
          <h2>Create a story</h2>
          <div className="form-row">
            <input
              className="input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="input"
              placeholder="Realm (e.g., Amazonia)"
              value={realm}
              onChange={(e) => setRealm(e.target.value)}
            />
            <input
              className="input small"
              placeholder="Emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
            />
          </div>

          <h3>Scenes</h3>
          <div className="list-grid">
            {scenes.map((s, idx) => (
              <div key={s.id} className="card-mini">
                <div className="meta">
                  id: {s.id}
                  {idx === 0 ? ' (start)' : ''}
                </div>
                <input
                  className="input"
                  value={s.title}
                  onChange={(e) => {
                    const v = [...scenes];
                    v[idx] = { ...v[idx], title: e.target.value };
                    setScenes(v);
                  }}
                />
                <textarea
                  className="textarea"
                  rows={3}
                  value={s.body}
                  onChange={(e) => {
                    const v = [...scenes];
                    v[idx] = { ...v[idx], body: e.target.value };
                    setScenes(v);
                  }}
                />
                <button className="btn outline" onClick={() => addChoice(s.id)}>
                  Add choice from this scene
                </button>
              </div>
            ))}
          </div>
          <div className="actions">
            <button className="btn outline" onClick={addScene}>
              Add scene
            </button>
          </div>

          <h3>Choices</h3>
          <div className="list-grid">
            {links.map((l, i) => (
              <div key={i} className="card-mini">
                <div className="meta">from: {l.from}</div>
                <input
                  className="input"
                  value={l.text}
                  onChange={(e) => {
                    const v = [...links];
                    v[i] = { ...v[i], text: e.target.value };
                    setLinks(v);
                  }}
                />
                <select
                  className="select"
                  value={l.to}
                  onChange={(e) => {
                    const v = [...links];
                    v[i] = { ...v[i], to: e.target.value };
                    setLinks(v);
                  }}
                >
                  {scenes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} – {s.title}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="actions">
            <button className="btn" onClick={saveStory}>
              Save to Library
            </button>
          </div>
          <p className="meta">Stories save to your browser (localStorage).</p>
        </section>
      )}

      {tab === 'library' && (
        <section>
          <h2>My Library</h2>
          {custom.length === 0 ? (
            <p className="meta">No custom stories yet.</p>
          ) : (
            <div className="list-grid">
              {custom.map((s) => (
                <div key={s.id} className="card-mini">
                  <div style={{ fontSize: 22 }}>{s.emoji || '📖'}</div>
                  <div style={{ fontWeight: 700 }}>{s.title}</div>
                  <div className="meta">{s.realm}</div>
                  <div className="actions" style={{ marginTop: 8 }}>
                    <button
                      className="btn outline"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(s, null, 2))}
                    >
                      Copy JSON
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        setActiveId(s.id);
                        setTab('play');
                      }}
                    >
                      Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'coming' && (
        <section>
          <h2>Coming Soon</h2>
          <ul>
            <li>AI co-authoring and world-aware prompts.</li>
            <li>Save to Passport with stamps & XP.</li>
            <li>Share stories with friends.</li>
          </ul>
        </section>
      )}
    </main>
  );
}
