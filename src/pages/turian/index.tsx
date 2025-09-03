import * as React from "react";
import { turianReply } from "@/lib/turian";
import { isDemo, AI_MODE } from "@/config/ai";
import { Link } from "react-router-dom";

type Msg = { role: "user" | "assistant" | "system"; content: string };

export default function TurianPage() {
  const [msgs, setMsgs] = React.useState<Msg[]>([
    { role: "system", content: "Turian is online." },
    { role: "assistant", content: "Hi! I’m Turian. How can I help?" },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    setErr("");
    setBusy(true);
    const next = [...msgs, { role: "user", content: text } as Msg];
    setMsgs(next);
    setInput("");

    try {
      const reply = await turianReply(next);
      setMsgs([...next, reply]);
    } catch (e: any) {
      setErr(e?.message || "Chat failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 820, margin: "0 auto" }}>
      <nav style={{ color: "#88a", margin: "8px 0 4px" }}>
        <Link to="/">Home</Link> / <span>Turian</span>
      </nav>
      <h1 style={{ color: "#1f50ff", fontSize: "2.25rem", margin: "8px 0 16px" }}>
        Turian the Durian
      </h1>
      <p style={{ marginBottom: 12, color: "#667" }}>
        {isDemo
          ? "Offline demo — no external calls or costs."
          : "Live AI mode — replies use your AI provider and may incur costs."}
        {" "}
        <span style={{ fontSize: 12, opacity: 0.7 }}>Mode: {AI_MODE}</span>
      </p>

      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 8px 30px rgba(0,0,0,.06)",
          padding: 16,
        }}
      >
        <div
          style={{
            height: 360,
            overflow: "auto",
            border: "1px solid #eef2f7",
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
            background: "#f9fbff",
          }}
        >
          {msgs.map((m, i) => (
            <div
              key={i}
              style={{
                margin: "6px 0",
                textAlign: m.role === "assistant" ? "left" : m.role === "user" ? "right" : "center",
                opacity: m.role === "system" ? 0.7 : 1,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "10px 12px",
                  borderRadius: 12,
                  background:
                    m.role === "assistant"
                      ? "#ffffff"
                      : m.role === "user"
                      ? "#1f50ff"
                      : "transparent",
                  color: m.role === "user" ? "#fff" : "#222",
                  border: m.role === "assistant" ? "1px solid #e8eef7" : "none",
                  maxWidth: 560,
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Turian about Worlds, Zones, or Navatar…"
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #dfe7f2",
            }}
          />
          <button
            className="btn"
            disabled={busy || !input.trim()}
            style={{
              background: "#1f50ff",
              color: "#fff",
              border: 0,
              borderRadius: 12,
              padding: "12px 16px",
              fontWeight: 700,
              minWidth: 100,
            }}
          >
            {busy ? "Thinking…" : "Send"}
          </button>
        </form>
        {err && <p style={{ color: "#d00", marginTop: 8 }}>{err}</p>}
      </div>

      <p style={{ marginTop: 12, color: "#778" }}>
        Tip: In demo mode I use built-in answers. Switch to live later by setting
        <code> VITE_AI_MODE=live</code> and deploying.
      </p>
    </div>
  );
}
