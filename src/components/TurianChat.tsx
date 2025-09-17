import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import "./turian.css";

type Msg = { role: "user" | "assistant"; content: string };

const OFFLINE_RESPONSES = [
  "Howdy! I'm Turian the Durian. Ask me for tips, quests, or fun facts. Dee mak!",
  "Seeds of curiosity grow big trees of wisdom. What do you want to explore?",
  "Try a mini-quest: do one kind thing today and tell me how it felt. Dee mak!",
];

export default function TurianChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: OFFLINE_RESPONSES[0] },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const msg = input.trim();
    if (!msg || busy) return;

    setInput("");
    const userMessage: Msg = { role: "user", content: msg };
    const nextHistory: Msg[] = [...messages, userMessage];
    setMessages(nextHistory);
    setBusy(true);

    try {
      const res = await fetch("/.netlify/functions/turian-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: nextHistory,
        }),
      });

      if (!res.ok) {
        throw new Error("bad status");
      }

      const data = (await res.json()) as { reply?: string };
      const reply =
        (data.reply || "").trim() ||
        OFFLINE_RESPONSES[(Math.random() * OFFLINE_RESPONSES.length) | 0];

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      const fallback =
        OFFLINE_RESPONSES[(Math.random() * OFFLINE_RESPONSES.length) | 0];
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            fallback +
            " (I’m in offline mode right now, but I still love to chat!)",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      send();
    }
  }

  return (
    <div className="turian-card">
      <h2 className="turian-title">Chat with Turian</h2>

      <div className="turian-chat" ref={scrollerRef} aria-live="polite">
        {messages.map((m, index) => (
          <div key={index} className={`turian-row ${m.role}`}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        {busy && (
          <div className="turian-row assistant">
            <div className="bubble typing" aria-label="Turian is typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
      </div>

      <div className="turian-input">
        <input
          aria-label="Message Turian"
          placeholder="Ask Turian something…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <button onClick={send} disabled={busy || !input.trim()}>
          {busy ? "Sending…" : "Send"}
        </button>
      </div>

      <p className="turian-footnote">
        Uses a free demo model via a secure Netlify Function. If the model isn’t
        reachable, Turian role-plays locally so the page never feels empty.
      </p>
    </div>
  );
}
