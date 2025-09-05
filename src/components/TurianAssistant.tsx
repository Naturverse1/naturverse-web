import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

function looksSignedIn() {
  // Supabase sets cookies starting with sb-; cheap, non-blocking check
  return typeof document !== "undefined" && /(?:^|;\s)sb-/.test(document.cookie);
}

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // zone hint (simple: first URL segment)
  const zone = useMemo(() => {
    const p = typeof window !== "undefined" ? window.location.pathname : "/";
    const seg = p.replace(/^\/+/, "").split("/")[0] || "home";
    return seg.toLowerCase();
  }, []);

  const send = useCallback(async () => {
    if (!input.trim() || sending) return;
    const userText = input.trim();
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: userText }]);
    setSending(true);

    try {
      // When logged out, reply with onboarding prompt locally and stop.
      if (!looksSignedIn()) {
        const hint =
          `You're in ${zone.charAt(0).toUpperCase() + zone.slice(1)}.\n` +
          `Please **create an account** or **Continue with Google** to get started.`;
        setMsgs((m) => [...m, { role: "assistant", content: hint }]);
        setSending(false);
        return;
      }

      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          zone,
          messages: [...msgs, { role: "user", content: userText }],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply: string =
        data?.reply ??
        `You're in ${zone}. Ask me about “languages”, “courses”, or “shop”.`;
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            `I couldn't reach the chat service. You're in ${zone}. Try “Where is languages?”`,
        },
      ]);
    } finally {
      setSending(false);
      // Important: keep drawer **open** after reply; do not auto-close.
    }
  }, [input, msgs, sending, zone]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* Floating button */}
      <button
        aria-label="Ask Turian"
        className="turian-btn"
        onClick={() => setOpen((v) => !v)}
      >
        <img
          src="/favicon-64x64.png" /* swap to any Turian head in /public */
          alt=""
          width={28}
          height={28}
          style={{ display: "block" }}
        />
      </button>

      {/* Drawer */}
      {open && (
        <div className="turian-drawer" role="dialog" aria-label="Ask Turian">
          <div className="turian-header">
            <strong>Ask Turian</strong>
            <button
              aria-label="Close"
              className="turian-close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="turian-body">
            {msgs.length === 0 && (
              <div className="turian-tip">Try: “Where is languages?”</div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`turian-msg ${m.role}`}>
                {m.role === "user" ? "You" : "Turian"}: {m.content}
              </div>
            ))}
          </div>

          <div className="turian-inputrow">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask Turian…"
              disabled={sending}
            />
            <button className="turian-send" onClick={send} disabled={sending}>
              {sending ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

