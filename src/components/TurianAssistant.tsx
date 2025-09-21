"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { assistantMap } from "@/data/assistantMap";
import { logEvent } from "@/lib/analytics";
import { findRoute } from "@/lib/navIntents";
import { askTurian, type ChatMessage } from "@/lib/ai/client";
import { buildMessages, type NavatarCtx } from "@/lib/ai/prompt";
import { getActiveNavatarForUser } from "@/lib/navatar/useNavatar";
import { useAuthUser } from "@/lib/useAuthUser";
import AssistantFab from "./AssistantFab";

/** Brand tokens (adjust if your blue is different) */
const BRAND_BLUE = "#2563EB"; // Naturverse blue
const RADIUS = 14;

type TurianAssistantProps = {
  /** When provided, this wins. If false, the widget won't render at all. */
  isAuthed?: boolean;
};

type ChatMsg = { role: "user" | "assistant"; content: string };

const ASSISTANT_HISTORY_LIMIT = 12;

const toAssistantHistory = (items: ChatMsg[]): ChatMessage[] =>
  items
    .map((msg): ChatMessage => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }))
    .filter((msg) => msg.content.trim().length > 0)
    .slice(-ASSISTANT_HISTORY_LIMIT);

function getZone(pathname: string) {
  // tiny helper so we can answer differently later (Home, Worlds, Zones, etc.)
  const p = (pathname || "/").toLowerCase();
  if (p.startsWith("/marketplace")) return "Marketplace";
  if (p.startsWith("/naturversity")) return "Naturversity";
  if (p.startsWith("/navatar")) return "Navatar";
  if (p === "/" || p.startsWith("/home")) return "Home";
  return "Site";
}

/** Dumb check: if a Supabase auth cookie exists, we treat as signed-in */
function isSignedIn() {
  try {
    const hasCookie = document.cookie
      .split("; ")
      .some((c) => c.startsWith("sb-") && c.includes("auth"));
    const hasStorage = Object.keys(localStorage).some(
      (k) => k.startsWith("sb-") && k.endsWith("-auth-token"),
    );
    return hasCookie || hasStorage;
  } catch {
    return false;
  }
}

export default function TurianAssistant({
  isAuthed,
}: TurianAssistantProps) {
  const { user } = useAuthUser();
  const routerLocation = useLocation();
  const pathname = routerLocation.pathname;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [navatar, setNavatar] = useState<NavatarCtx>({});
  const listRef = useRef<HTMLDivElement | null>(null);

  const zone = useMemo(() => getZone(pathname), [pathname]);
  const theme = useMemo(() => ({ route: pathname || "/", zone }), [pathname, zone]);

  useEffect(() => {
    // starter tip so the box isn't empty
    if (messages.length === 0) {
      const keys = Object.keys(assistantMap);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setMessages([
        { role: "assistant", content: `Try: \"Where is ${randomKey}?\"` },
      ]);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    let active = true;

    if (!user?.id) {
      setNavatar({});
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        const data = await getActiveNavatarForUser(user.id);
        if (!active) return;
        setNavatar(data);
      } catch {
        if (!active) return;
        setNavatar({});
      }
    })();

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (listRef.current) {
      try {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth" as ScrollBehavior,
        });
      } catch {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const derived = useMemo(() => {
    if (typeof isAuthed === "boolean") return isAuthed;
    return isSignedIn();
  }, [isAuthed]);

  if (!derived) return null;

  function openBot() {
    setOpen(true);
    void logEvent({ event: "bot_open", from_page: pathname });
  }
  function closeBot() {
    setOpen(false);
    void logEvent({ event: "bot_close", from_page: pathname });
  }

  async function onSend() {
    const text = input.trim();
    if (!text || thinking) return;

    await logEvent({
      event: "bot_message",
      from_page: pathname,
      text,
    });

    const target = findRoute(text);
    if (target) {
      await logEvent({
        event: "bot_navigate",
        from_page: pathname,
        to_page: target,
        text,
      });
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Taking you to ${target}…` },
      ]);
      window.location.assign(target);
      return;
    }

    if (!isSignedIn()) {
      setMessages((m) => [
        ...m,
        { role: "user", content: text },
        {
          role: "assistant",
          content:
            "Please create an account or continue with Google to get started!",
        },
      ]);
      setInput("");
      return;
    }

    const history = toAssistantHistory(messages);
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");

    try {
      setThinking(true);
      const baseMessages = buildMessages(text, navatar, theme);
      const [systemMessage, userMessage] = baseMessages;
      const payload: ChatMessage[] = [systemMessage, ...history, userMessage].filter(
        (msg): msg is ChatMessage => Boolean(msg?.content),
      );
      const reply = await askTurian(payload);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: reply },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void onSend();
    }
  }

  return (
    <>
      {!open && (
        <AssistantFab
          ariaLabel="Ask Turian"
          onClick={openBot}
        />
      )}

      {/* Drawer */}
      {open && (
        <div
          role="dialog"
          aria-label="Ask Turian"
          style={{
            position: "fixed",
            right: 12,
            bottom: 12,
            width: "min(420px, 92vw)",
            maxHeight: "72vh", // mobile-safe
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: RADIUS,
            boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
            zIndex: 90_001,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: BRAND_BLUE,
              color: "#fff",
              padding: "10px 12px",
            }}
          >
            <img
              src="/favicon-64x64.png"
              alt="Turian"
              width={20}
              height={20}
              style={{ borderRadius: 6, background: "#fff" }}
            />
            <strong style={{ fontWeight: 700 }}>Ask Turian</strong>
            <div style={{ flex: 1 }} />
            <button
              aria-label="Close"
              onClick={closeBot}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "4px 8px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              X
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="nv-assistant-messages"
            style={{
              padding: 12,
              overflowY: "auto",
              gap: 8,
              display: "flex",
              flexDirection: "column",
              background: "#F8FAFC",
              maxHeight: 360,
              paddingRight: 8,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? BRAND_BLUE : "#fff",
                  color: m.role === "user" ? "#fff" : "#111827",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 12,
                  padding: "8px 10px",
                  maxWidth: "90%",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>
            ))}
          </div>

          {/* Input row */}
          <div
            style={{
              padding: 12,
              borderTop: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              gap: 8,
              background: "#fff",
            }}
          >
            <input
              aria-label="Ask Turian"
              placeholder="Ask Turian…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={thinking}
              style={{
                flex: 1,
                fontSize: 16,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.12)",
                outline: "none",
              }}
            />
            <button
              onClick={onSend}
              disabled={thinking || !input.trim()}
              style={{
                background: BRAND_BLUE,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 14px",
                fontWeight: 700,
                cursor: thinking ? "default" : "pointer",
                opacity: thinking || !input.trim() ? 0.6 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

