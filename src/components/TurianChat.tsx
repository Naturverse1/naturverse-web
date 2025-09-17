import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import "./turian-chat.css";

type Role = "user" | "assistant";

type ConversationMessage = {
  id: string;
  role: Role;
  content: string;
  offline?: boolean;
};

type ChatStatus = "checking" | "online" | "offline";

const STORAGE_KEY = "naturverse:turian";
const MAX_HISTORY = 20;
const MAX_INPUT_CHARS = 800;
const FUNCTION_ENDPOINT = "/.netlify/functions/turian-chat";
const SYSTEM_PROMPT = `You are Turian the Durian—cheerful, concise, G-rated guide to the Naturverse.
If asked outside Naturverse scope, give a short friendly answer.
Keep replies under 80–120 words.`;

const DEFAULT_GREETING: ConversationMessage = {
  id: "turian-greeting",
  role: "assistant",
  content:
    "Heya! I'm Turian the Durian, your cheerful Naturverse guide. Ask for quests, tips, or fun facts and I'll keep it light!",
};

const OFFLINE_REPLIES = [
  "My cloud link is snoozing, but Turian's roots stay steady. Try one tiny Naturverse act—stretch like a fern and picture the jungle cheering you on.",
  "Offline mode engaged, yet I'm still bursting with jungle cheer. Sketch or jot a quick idea so we can grow it together when the breeze returns.",
  "Even without the Groq gusts, I can offer a seed of wonder. Take three slow breaths and imagine bioluminescent vines lighting your next step.",
  "The data vines are tangled right now, but kindness still travels fast. Share a smile or refill a bottle to keep Naturverse magic flowing.",
];

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value.charCodeAt(index);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

function summarizePrompt(prompt: string) {
  const trimmed = prompt.trim();
  if (!trimmed) return "";
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed;
}

function createOfflineMessage(prompt: string) {
  const seed = prompt ? hashString(prompt) : Date.now();
  const index = Math.abs(seed) % OFFLINE_REPLIES.length;
  const base = OFFLINE_REPLIES[index];
  const snippet = summarizePrompt(prompt);

  if (!snippet) {
    return `${base} I'll be back online soon with more sparkle.`;
  }

  return `${base} I saved your question "${snippet}" for when the signal returns.`;
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadInitialMessages(): ConversationMessage[] {
  if (typeof window === "undefined") {
    return [DEFAULT_GREETING];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [DEFAULT_GREETING];

    const parsed = JSON.parse(raw) as ConversationMessage[];
    if (!Array.isArray(parsed)) return [DEFAULT_GREETING];

    const sanitized = parsed.reduce<ConversationMessage[]>((acc, entry) => {
      if (!entry || typeof entry !== "object") {
        return acc;
      }

      const message = entry as Partial<ConversationMessage> & Record<string, unknown>;
      const content = typeof message.content === "string" ? message.content.trim() : "";
      if (!content) {
        return acc;
      }

      const role: Role = message.role === "user" ? "user" : "assistant";
      acc.push({
        id: typeof message.id === "string" ? message.id : makeId(),
        role,
        content,
        offline: message.offline === true ? true : undefined,
      });

      return acc;
    }, []);

    return sanitized.length ? sanitized.slice(-MAX_HISTORY) : [DEFAULT_GREETING];
  } catch {
    return [DEFAULT_GREETING];
  }
}

export default function TurianChat() {
  const [messages, setMessages] = useState<ConversationMessage[]>(() => loadInitialMessages());
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>(() =>
    typeof window === "undefined" ? "offline" : "checking",
  );
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const snapshot = messages.slice(-MAX_HISTORY);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Ignore storage failures silently.
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const animation = requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    return () => cancelAnimationFrame(animation);
  }, [messages, loading]);

  const ensureOnline = useCallback(async (): Promise<"online" | "offline"> => {
    if (typeof window === "undefined" || typeof fetch === "undefined") {
      return "offline";
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7_000);
      const response = await fetch(FUNCTION_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { status?: string }
          | null;

        if (data?.status === "online") {
          setStatus("online");
          return "online";
        }
      }
    } catch {
      // ignore network errors – we'll fall back to offline
    }

    setStatus("offline");
    return "offline";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    void ensureOnline();
  }, [ensureOnline]);

  const appendOffline = useCallback((prompt: string) => {
    const offlineMessage: ConversationMessage = {
      id: makeId(),
      role: "assistant",
      content: createOfflineMessage(prompt),
      offline: true,
    };

    setMessages((prev) => {
      const next = [...prev, offlineMessage];
      return next.slice(-MAX_HISTORY);
    });
  }, []);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    if (trimmed.length > MAX_INPUT_CHARS) {
      setInput(trimmed.slice(0, MAX_INPUT_CHARS));
      return;
    }

    const userMessage: ConversationMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
    };

    const nextHistory = [...messages, userMessage].slice(-MAX_HISTORY);
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    const currentStatus = await ensureOnline();
    if (currentStatus !== "online") {
      appendOffline(trimmed);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch(FUNCTION_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...nextHistory.map(({ role, content }) => ({ role, content })),
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        setStatus("offline");
        appendOffline(trimmed);
        return;
      }

      const data = (await response.json().catch(() => null)) as { content?: string } | null;
      const text = data?.content ? String(data.content).trim() : "";

      if (!text) {
        setStatus("offline");
        appendOffline(trimmed);
        return;
      }

      const assistantMessage: ConversationMessage = {
        id: makeId(),
        role: "assistant",
        content: text,
      };

      setStatus("online");
      setMessages((prev) => {
        const next = [...prev, assistantMessage];
        return next.slice(-MAX_HISTORY);
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Turian chat request failed", error);
      }
      setStatus("offline");
      appendOffline(trimmed);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  const statusLabel =
    status === "online" ? "Online" : status === "offline" ? "Offline mode" : "Checking…";

  const statusDescription =
    status === "online"
      ? "Connected via Groq (meta-llama/llama-3.1-8b-instant)."
      : status === "offline"
        ? "Offline mode active—Turian replies locally until the link returns."
        : "Checking Groq connection…";

  return (
    <section className="turian-chat-card" aria-label="Chat with Turian">
      <header className="turian-chat-header">
        <h3 className="turian-chat-title">Chat with Turian</h3>
        <span className={`turian-chat-status ${status}`} role="status" aria-live="polite">
          <span className="turian-chat-status-dot" aria-hidden />
          {statusLabel}
        </span>
      </header>

      <div
        ref={scrollRef}
        className="turian-chat-scroll"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Turian conversation thread"
      >
        {messages.map((message) => (
          <div key={message.id} className={`turian-chat-row ${message.role}`}>
            <div
              className={`turian-chat-bubble ${message.role}${message.offline ? " offline" : ""}`}
            >
              {message.offline && (
                <span className="turian-chat-chip offline">
                  <span className="turian-chat-chip-dot" aria-hidden />
                  Offline mode
                </span>
              )}
              <p>{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="turian-chat-row assistant typing" aria-hidden="true">
            <div className="turian-chat-bubble assistant">
              <span className="turian-chat-chip typing" aria-hidden>
                <span className="turian-chat-chip-dot" aria-hidden />
                Turian is typing
              </span>
              <div className="turian-chat-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} aria-hidden="true" />
      </div>

      <div className="turian-chat-composer">
        <input
          type="text"
          aria-label="Message Turian"
          placeholder="Ask Turian something…"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
          maxLength={MAX_INPUT_CHARS}
          autoComplete="off"
          enterKeyHint="send"
          spellCheck
        />
        <button
          type="button"
          className="turian-chat-send"
          onClick={() => void sendMessage()}
          disabled={loading || !input.trim()}
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>

      <p className="turian-chat-footnote" aria-live="polite">
        <strong>{statusLabel}.</strong> {statusDescription}
      </p>
    </section>
  );
}
