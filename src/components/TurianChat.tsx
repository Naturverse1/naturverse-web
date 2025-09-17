import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import "./turian-chat.css";

type Msg = { role: "user" | "assistant"; content: string };
type ApiMessage = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT =
  "You are Turian the Durian, a cheerful Naturverse guide. " +
  "Answer briefly (1-4 sentences), be playful but helpful, avoid claims that require real-world actions.";

const LS_KEY = "naturverse_turian_chat_v1";
const DEFAULT_GREETING: Msg = {
  role: "assistant",
  content: "Howdy! I'm Turian the Durian. Ask for tips, quests, or fun facts. 🥥🌿",
};

async function askTurian(messages: ApiMessage[]): Promise<string> {
  const res = await fetch("/.netlify/functions/turian-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Turian is offline (${res.status}): ${err}`);
  }

  const { reply } = (await res.json()) as { reply?: string };
  return typeof reply === "string" ? reply : "";
}

function offlineReply(input: string): string {
  const tips = [
    "Plant a tiny seed of kindness today.",
    "Take three slow breaths—growth starts inside.",
    "Spot one green thing nearby and smile at it.",
    "Tiny steps beat perfect plans. What's one step?",
  ];
  const pick = tips[(input.length + tips.length) % tips.length];
  return `Offline Turian here 🌱\n${pick}`;
}

export default function TurianChat() {
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [DEFAULT_GREETING];
    try {
      const saved = window.localStorage.getItem(LS_KEY);
      return saved ? (JSON.parse(saved) as Msg[]) : [DEFAULT_GREETING];
    } catch {
      return [DEFAULT_GREETING];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LS_KEY, JSON.stringify(messages));
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const apiMessages = useMemo<ApiMessage[]>(
    () => [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((message) => ({ role: message.role, content: message.content })),
    ],
    [messages],
  );

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const mine: Msg = { role: "user", content: trimmed };
    const chatPayload: ApiMessage[] = [...apiMessages, { role: "user", content: trimmed }];
    setMessages((prev) => [...prev, mine]);
    setInput("");
    setLoading(true);
    const fallback = offlineReply(trimmed);

    try {
      const reply = (await askTurian(chatPayload)).trim();
      const text = reply || fallback;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: text },
      ]);
    } catch (error) {
      console.error("Turian chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallback },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className="turian-card turian-chat-card">
      <h3 className="turian-chat-title">Chat with Turian</h3>
      <div className="turian-chat-scroll" ref={scrollRef} aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`turian-chat-bubble ${message.role}`}>
            <p>{message.content}</p>
          </div>
        ))}
        {loading && (
          <div className="turian-chat-typing" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className="turian-chat-composer">
        <input
          aria-label="Message Turian"
          placeholder="Ask Turian something…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="turian-chat-send" onClick={send} disabled={loading || !input.trim()}>
          {loading ? "Sending…" : "Send"}
        </button>
      </div>

      <p className="turian-chat-footnote">
        Uses a free demo model via a secure Netlify Function. If the model isn’t reachable,
        Turian role-plays locally so the page never feels empty.
      </p>
    </div>
  );
}
