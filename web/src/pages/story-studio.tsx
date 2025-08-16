import React, { useState } from "react";

export default function StoryStudio() {
  const [topic, setTopic] = useState("A tiny dragon who loves rainforests");
  const [age, setAge] = useState(8);
  const [tone, setTone] = useState("curious");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");

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

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating…" : "Make Story"}
      </button>

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
    </div>
  );
}
