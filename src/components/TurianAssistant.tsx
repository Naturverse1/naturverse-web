import { useEffect, useRef, useState } from "react";
import { ChatDrawer } from "./ChatDrawer";
import { sendChat, type ChatMsg } from "../lib/chat";
import "./chat.css";

const TURION_EMOJI = "🟢"; // uses your footer brand-blue; swap later for head SVG if desired

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  // Guard for SSR / hydration
  const canMount = typeof window !== "undefined" && typeof document !== "undefined";

  // Derive a simple current path for “zone awareness”
  const path = canMount ? window.location.pathname : "/";

  // Auto-collapse on small screens after reply
  const isMobile = canMount ? window.matchMedia("(max-width: 640px)").matches : false;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || busy) return;

    const next = [...msgs, { role: "user", content: text.trim() } as ChatMsg];
    setMsgs(next);
    setText("");
    setBusy(true);

    const replied = await sendChat(next, path);
    setMsgs(replied.length ? replied : next);
    setBusy(false);

    if (isMobile) {
      // give a short beat so user sees the answer, then collapse
      setTimeout(() => setOpen(false), 800);
    }
  }

  if (!canMount) return null;

  return (
    <>
      <button className="tv-fab" aria-label="Open Turian assistant" onClick={() => setOpen(true)}>
        {TURION_EMOJI}
      </button>

      <ChatDrawer open={open} onClose={() => setOpen(false)}>
        <div className="tv-messages">
          {msgs.length === 0 ? (
            <p className="tv-hint">Ask me about Worlds, Zones, Naturversity, Marketplace, or Navatars.</p>
          ) : (
            msgs.map((m, i) => (
              <div key={i} className={`tv-msg ${m.role}`}>
                {m.content}
              </div>
            ))
          )}
          {busy && <div className="tv-msg assistant">Thinking…</div>}
        </div>

        <form className="tv-form" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            className="tv-input"
            placeholder="Ask Turian…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="tv-send" disabled={busy || !text.trim()} aria-label="Send">
            ↩︎
          </button>
        </form>
      </ChatDrawer>
    </>
  );
}
