"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Role = "user" | "assistant" | "system";
type ChatMsg = { role: Role; content: string };

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const drawer = document.getElementById("turian-drawer");
      const button = document.getElementById("turian-button");
      if (!drawer || !button) return;
      if (open && !drawer.contains(e.target as Node) && !button.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, zone: zoneFromPath(pathname) }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (window.matchMedia("(max-width: 768px)").matches) setOpen(false);
    } catch (err: any) {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        id="turian-button"
        aria-label="Open Turian assistant"
        onClick={() => setOpen((o) => !o)}
        style={btnStyle}
      >
        <span style={badgeStyle}>🤖</span>
      </button>

      {/* Drawer */}
      {open && (
        <div id="turian-drawer" style={drawerStyle}>
          <div style={headerStyle}>
            <strong>Ask Turian</strong>
            <button aria-label="Close" onClick={() => setOpen(false)} style={closeStyle}>
              ✕
            </button>
          </div>

          <div style={scrollStyle}>
            {messages.length === 0 && (
              <p style={{ opacity: 0.7, margin: 0 }}>How can I help? Try “Where is languages?”</p>
            )}
            {messages.map((m, i) => (
              <p key={i} style={{ margin: "6px 0" }}>
                <span style={{ fontWeight: m.role === "user" ? 600 : 500 }}>
                  {m.role === "user" ? "You" : "Turian"}:
                </span>{" "}
                {m.content}
              </p>
            ))}
            {error && <p style={{ color: "#c00", marginTop: 6 }}>{error}</p>}
          </div>

          <form onSubmit={send} style={formStyle}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Turian…"
              aria-label="Message"
              style={inputStyle}
            />
            <button disabled={busy} style={sendStyle}>
              {busy ? "…" : "Send"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function zoneFromPath(path: string | null) {
  if (!path) return "home";
  if (path.startsWith("/naturversity")) return "naturversity";
  if (path.startsWith("/marketplace")) return "marketplace";
  if (path.startsWith("/navatar")) return "navatar";
  if (path.startsWith("/zones")) return "zones";
  if (path.startsWith("/worlds")) return "worlds";
  return "home";
}

/* --- inline styles (kept tiny and local) --- */
const btnStyle: React.CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 16,
  width: 52,
  height: 52,
  borderRadius: 26,
  border: "0",
  boxShadow: "0 4px 12px rgba(0,0,0,.15)",
  background: "#eaf1ff",
  cursor: "pointer",
  zIndex: 9999,
};
const badgeStyle: React.CSSProperties = { fontSize: 24, lineHeight: "52px" };

const drawerStyle: React.CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 80,
  width: 340,
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "40vh",
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 12px 32px rgba(0,0,0,.2)",
  padding: 12,
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  border: "1px solid rgba(0,0,0,.06)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBottom: 8,
  borderBottom: "1px solid rgba(0,0,0,.06)",
};

const closeStyle: React.CSSProperties = {
  appearance: "none",
  border: 0,
  background: "#1e66ff",
  color: "#fff",
  borderRadius: 6,
  width: 28,
  height: 28,
  cursor: "pointer",
};

const scrollStyle: React.CSSProperties = {
  overflowY: "auto",
  padding: "8px 2px",
  flex: 1,
};

const formStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginTop: 8,
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  borderRadius: 8,
  border: "1px solid #cfd8ff",
  padding: "10px 12px",
  outline: "none",
};

const sendStyle: React.CSSProperties = {
  borderRadius: 8,
  border: 0,
  padding: "10px 14px",
  background: "#1e66ff",
  color: "#fff",
  cursor: "pointer",
};

