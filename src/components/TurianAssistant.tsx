"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Brand tokens (adjust if your blue is different) */
const BRAND_BLUE = "#2563EB"; // Naturverse blue

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
  // Supabase sets "sb-" cookies; keep it simple and robust
  return document.cookie.includes("sb-") || document.cookie.includes("supabase");
}

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const zone = useMemo(() => getZone(window.location.pathname), []);

  useEffect(() => {
    // starter tip so the box isn't empty
    if (messages.length === 0) {
      setMessages([
        { role: "assistant", content: `Try: "Where is languages?"` },
      ]);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    // keep the latest reply in view
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    if (open && mq.matches) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = input.trim();
    if (!text || busy) return;

    setInput("");

    const signed = isSignedIn();
    const initialNudgeNeeded = !signed && messages.length === 1;
    const payload = [
      { role: "system", content: `You are Turian in ${zone}.` },
      ...messages,
      { role: "user", content: text },
    ];

    setMessages((m) => {
      const base = [...m, { role: "user", content: text }];
      return initialNudgeNeeded
        ? [
            ...base,
            {
              role: "assistant",
              content:
                "Please create an account or continue with Google to get started!",
            },
          ]
        : base;
    });

    if (initialNudgeNeeded) return;

    setBusy(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zone, messages: payload }),
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

  return (
    <>
      {/* Floating button (bottom-right) */}
      <button
        className="ta-fab"
        onClick={() => setOpen(true)}
        aria-label="Open Turian"
      >
        <img src="/favicon-64x64.png" alt="" />
      </button>
      {open
        ? createPortal(
            <div
              className={`turian-assistant ${open ? "open" : ""}`}
              role="dialog"
              aria-label="Ask Turian"
            >
              <header className="ta-header">
                <img
                  src="/favicon-64x64.png"
                  alt=""
                  className="ta-avatar"
                />
                <strong>Ask Turian</strong>
                <button
                  className="ta-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </header>
              <div className="ta-body" ref={scrollRef}>
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
                <div ref={endRef} />
              </div>
              <form className="ta-input" onSubmit={handleSend}>
                <input
                  aria-label="Ask Turian"
                  placeholder="Ask Turian…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={busy}
                />
                <button type="submit" disabled={busy || !input.trim()}
                >
                  Send
                </button>
              </form>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

