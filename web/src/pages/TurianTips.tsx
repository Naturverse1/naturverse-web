import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // adjust path to your client

type Tip = { id: number; content: string; topic?: string | null; created_at?: string };

export default function TurianTips() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("eco-friendly living");
  const [error, setError] = useState<string | null>(null);

  async function loadTips() {
    const { data, error } = await supabase
      .from("tips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) setError(error.message);
    else setTips(data ?? []);
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/.netlify/functions/generate-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) throw new Error(await res.text());
      await loadTips();
    } catch (e: any) {
      setError(e?.message || "Failed to generate tip");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTips(); }, []);

  return (
    <section style={{ padding: 16 }}>
      <h2>🌱 Turian Tips</h2>
      <div style={{ margin: "12px 0" }}>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="topic (optional)"
        />
        <button onClick={generate} disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? "Generating…" : "➕ Generate Tip with AI"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tips.length === 0 ? <p>No tips yet.</p> : (
        <ul>
          {tips.map(t => (
            <li key={t.id} style={{ marginBottom: 8 }}>{t.content}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
