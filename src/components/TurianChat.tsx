import { useEffect, useRef, useState } from "react";

type Message = { role: "user"|"assistant"|"system"; content: string; offline?: boolean };

export default function TurianChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Howdy! I'm Turian the Durian. Ask for tips, quests, or fun facts. 🥥🌿" }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages(m => [...m, { role: "user", content: text }]);
    setInput("");
    setSending(true);
    setTyping(true);

    // call Netlify function
    try {
      const res = await fetch("/.netlify/functions/turian-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: text }] })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { content: string; offline?: boolean };

      setMessages(m => [...m, { role: "assistant", content: data.content, offline: data.offline }]);
    } catch (err) {
      // Friendly toast & offline fallback already handled server-side, but keep a local guard:
      setMessages(m => [...m, { role: "assistant", content: "🌐 Connection was slow—switching to my local wisdom for now. Ask me anything!", offline: true }]);
    } finally {
      setSending(false);
      setTyping(false);
    }
  }

  return (
    <div className="turian-chat">
      <div className="turian-chat-card">
        <div
          ref={listRef}
          style={{ maxHeight: "52vh", overflowY: "auto", padding: "6px 2px" }}
          aria-live="polite"
        >
          {messages.map((m, i) => (
            <div key={i} className={`turian-msg ${m.role === "user" ? "me" : ""}`}>
              {m.content}{m.offline ? " (offline mode)" : ""}
            </div>
          ))}
          {typing && (
            <div className="turian-typing"><i/><i/><i/></div>
          )}
        </div>

        <form className="turian-input-row" onSubmit={onSend}>
          <input
            className="turian-input"
            aria-label="Ask Turian"
            placeholder="Ask Turian something…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="turian-send btn btn-primary" disabled={!input.trim() || sending}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
