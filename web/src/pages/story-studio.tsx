import React, { useState, useEffect } from "react";
import { saveStory, listStories, StoryListItem } from '../lib/db';

export default function StoryStudio() {
  const [topic, setTopic] = useState("A tiny dragon who loves rainforests");
  const [age, setAge] = useState(8);
  const [tone, setTone] = useState("curious");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<StoryListItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setHistory(await listStories());
      } catch {
        /* ignore if signed out */
      }
    })();
  }, []);

  async function generate() {
    setLoading(true);
    setStory("");
    const res = await fetch("/.netlify/functions/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, age, tone, length: 500 }),
    });
    const json = await res.json();
    setStory(json.story || "No story.");
    setLoading(false);
  }

  async function onSave() {
    if (!story.trim()) {
      alert("Make a story first!");
      return;
    }
    setSaving(true);
    try {
      await saveStory({
        title: topic.slice(0, 60) || "Naturverse story",
        prompt: topic,
        content: story,
      });
      alert("Story saved 🌱");
      setHistory(await listStories());
    } catch (e: any) {
      alert(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 840, margin: "0 auto", padding: "2rem" }}>
      <h1>Story Studio</h1>
      <p>Create kid-safe, nature-themed stories.</p>

      <label>Topic</label>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <label>
          Age
          <input
            type="number"
            min={5}
            max={12}
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value || "8"))}
            style={{ marginLeft: 8, width: 80 }}
          />
        </label>
        <label>
          Tone
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option>curious</option>
            <option>adventurous</option>
            <option>gentle</option>
            <option>funny</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={generate} disabled={loading}>
          {loading ? "Generating…" : "Make Story"}
        </button>
        <button onClick={onSave} disabled={saving || !story}>
          {saving ? "Saving…" : "Save to My Stories"}
        </button>
      </div>

      {story && (
        <article
          style={{
            whiteSpace: "pre-wrap",
            marginTop: 24,
            background: "rgba(0,0,0,0.2)",
            padding: 16,
            borderRadius: 8,
          }}
        >
          {story}
        </article>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>My Stories</h3>
          <ul>
            {history.map((s) => (
              <li key={s.id}>
                {s.title} — {new Date(s.created_at).toLocaleString()} ({s.words ?? 0} words)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
