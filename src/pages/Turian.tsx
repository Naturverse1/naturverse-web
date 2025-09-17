import React, { useEffect, useRef, useState } from "react";
import "./turian.css";

type Message = { role: "user" | "assistant"; content: string };

export default function TurianPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Howdy! I'm Turian the Durian 🍈🌿 Ask for tips, quests, or fun facts." }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send() {
    const question = input.trim();
    if (!question || busy) return;

    setInput("");
    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setBusy(true);

    try {
      const res = await fetch("/.netlify/functions/turian-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "…(no reply)…" }
      ]);
    } catch (error) {
      console.error("Turian chat error", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "My vines got tangled. Try again in a moment!" }
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  return (
    <main className="turian-wrap">
      <header className="turian-hero">
        <h1>Turian the Durian</h1>
        <p>Ask for tips, quests, and facts. This runs on a free demo model (or a playful offline persona).</p>
      </header>

      <section className="turian-card">
        <h2>Chat with Turian</h2>
        <div className="chat-box" role="log" aria-live="polite">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`row ${message.role}`}>
              <div className="bubble">{message.content}</div>
            </div>
          ))}
          {busy && (
            <div className="row assistant">
              <div className="bubble bubble-dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="composer">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Turian something…"
            aria-label="Message Turian"
            disabled={busy}
          />
          <button className="btn" onClick={send} disabled={busy || !input.trim()}>
            {busy ? "Sending…" : "Send"}
          </button>
        </div>
      </section>

      <section className="turian-note">
        <em>No external calls? I’ll still role-play locally so the page never feels empty.</em>
      </section>
    </main>
  );
}
