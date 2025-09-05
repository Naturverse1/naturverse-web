"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { assistantMap } from "@/data/assistantMap";
import { supabase } from "@/lib/supabase-client";

/** Brand tokens (adjust if your blue is different) */
const BRAND_BLUE = "#2563EB"; // Naturverse blue
const RADIUS = 14;

type TurianAssistantProps = {
  /** When provided, this wins. If false, the widget won't render at all. */
  isAuthed?: boolean;
};

type ChatMsg = { role: "user" | "assistant"; content: string };

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

function getIntentPath(message: string): string | null {
  const lower = message.toLowerCase();
  for (const [key, { path, synonyms }] of Object.entries(assistantMap)) {
    if (lower.includes(key) || synonyms.some((s) => lower.includes(s))) {
      return path;
    }
  }
  return null;
}

async function logEvent(from: string, to: string, text: string) {
  try {
    await supabase
      .from("analytics")
      .insert([{ event: "bot_navigate", from_page: from, to_page: to, text }]);
  } catch (e) {
    console.warn("logEvent failed", e);
  }
}

export default function TurianAssistant({
  isAuthed,
}: TurianAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const areaRef = useRef<HTMLDivElement>(null);

  const zone = useMemo(() => getZone(window.location.pathname), []);

  useEffect(() => {
    // starter tip so the box isn't empty
    if (messages.length === 0) {
      const keys = Object.keys(assistantMap);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setMessages([
        { role: "assistant", content: `Try: "Where is ${randomKey}?"` },
      ]);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    // keep scroll pinned to bottom on new content
    const el = areaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const derived = useMemo(() => {
    if (typeof isAuthed === "boolean") return isAuthed;
    return isSignedIn();
  }, [isAuthed]);

  if (!derived) return null;

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    // If logged out, show CTA and keep drawer open
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

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");

      const path = getIntentPath(text);
      if (path) {
        logEvent(window.location.pathname, path, text);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `On it! Taking you to ${path}…`,
          },
        ]);
        setOpen(false);
        setTimeout(() => {
          window.location.href = path;
        }, 150);
        return;
      }

    setBusy(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zone,
          messages: [
            // give the function a tiny bit of context
            { role: "system", content: `You are Turian in ${zone}.` },
            ...messages,
            { role: "user", content: text },
          ],
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { reply?: string };
      setMessages((m) => [
        ...m,
        { role: "assistant", content: json.reply || "Okay!" },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setBusy(false);
    }
    // IMPORTANT: we do NOT auto-close; the X is always visible
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Floating button (bottom-right) */}
      <button
        aria-label="Ask Turian"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#ffffff",
          border: `2px solid ${BRAND_BLUE}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          display: open ? "none" : "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          cursor: "pointer",
          zIndex: 90_000,
        }}
      >
        {/* Turian head from /public */}
        <img
          src="/favicon-64x64.png"
          alt="Turian"
          width={32}
          height={32}
          style={{ display: "block" }}
        />
      </button>

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
              onClick={() => setOpen(false)}
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
            ref={areaRef}
            style={{
              padding: 12,
              overflow: "auto",
              gap: 8,
              display: "flex",
              flexDirection: "column",
              background: "#F8FAFC",
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
              disabled={busy}
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
              onClick={send}
              disabled={busy || !input.trim()}
              style={{
                background: BRAND_BLUE,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 14px",
                fontWeight: 700,
                cursor: busy ? "default" : "pointer",
                opacity: busy || !input.trim() ? 0.6 : 1,
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

