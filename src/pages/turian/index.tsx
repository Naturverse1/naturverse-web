import * as React from "react";
import { turianReply } from "@/lib/turian";
import { isDemo, AI_MODE } from "@/lib/ai";
import Breadcrumbs from "../../components/Breadcrumbs";
import Button from "../../components/Button";
import "../../styles/turian.css";

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
    <main className="turian container max-w-[820px] mx-auto">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Turian" }]} />
      <h1 className="text-4xl font-extrabold text-strong">Turian the Durian</h1>

      <p className="mt-2 text-sm brand-muted">
        Tip: In demo mode I use built-in answers. Switch to live later by setting
        <code className="mx-1 rounded bg-primary-50 px-2 py-0.5 text-primary-700">VITE_AI_MODE=live</code>
        and deploying.
      </p>

      <section className="brand-chat mt-6 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
        <div className="status">
          {isDemo()
            ? "Offline demo — no external calls or costs."
            : "Live AI mode — replies use your AI provider and may incur costs."}{" "}
          <em>Mode: {AI_MODE}</em>
        </div>

        <div className="chat-log">
          {msgs.map((m, i) => (
            <div
              key={i}
              style={{
                margin: "6px 0",
                textAlign:
                  m.role === "assistant"
                    ? "left"
                    : m.role === "user"
                    ? "right"
                    : "center",
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
                      ? "var(--brand-primary-600)"
                      : "transparent",
                  color: m.role === "user" ? "#fff" : "var(--text-base)",
                  border: m.role === "assistant" ? "1px solid var(--brand-primary-100)" : "none",
                  maxWidth: 560,
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={send} className="chat-entry">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Turian about Worlds, Zones, or Navatar…"
          />
          <Button disabled={busy || !input.trim()}>
            {busy ? "Thinking…" : "Send"}
          </Button>
        </form>
        {err && <p style={{ color: "#d00", marginTop: 8 }}>{err}</p>}
      </section>
    </main>
  );
}
