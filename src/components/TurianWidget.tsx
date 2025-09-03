import * as React from "react";
import { isDemo } from "../lib/ai";

type Msg = { who: "bot" | "you"; text: string };

const demoReply = (q: string): string => {
  const s = q.toLowerCase();
  if (s.includes("world")) return "Worlds are big themed lands you can explore.";
  if (s.includes("zone")) return "Zones are bite-sized adventures inside each World.";
  if (s.includes("navatar") || s.includes("avatar"))
    return "Navatar is your avatar. Generate one on the Navatar page—try storybook or character-sheet vibes!";
  if (s.includes("bank")) return "NaturBank keeps your earned naturCoins safe.";
  return "Got it! (Demo mode) — I’m not calling any AI right now.";
};

export default function TurianWidget() {
  // Only mount in demo mode
  if (!isDemo()) return null;

  const [open, setOpen] = React.useState(false);
  const [msgs, setMsgs] = React.useState<Msg[]>([
    { who: "bot", text: "Hi! I’m Turian. Ask about Worlds, Zones, or Navatar." },
  ]);
  const [text, setText] = React.useState("");

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { who: "you", text: t }]);
    setText("");
    // canned reply
    setTimeout(() => {
      setMsgs((m) => [...m, { who: "bot", text: demoReply(t) }]);
    }, 250);
  };

  return (
    <>
      <button
        aria-label="Open Turian chat"
        onClick={() => setOpen(true)}
        className="turian-fab nv-fab"
      >
        💬
      </button>

      {open && (
        <div className="turian-sheet turian-chat" role="dialog" aria-modal="true">
          <div className="turian-card">
            <header className="turian-header">
              <strong>Turian (demo)</strong>
              <button className="turian-close" onClick={() => setOpen(false)}>×</button>
            </header>

            <div className="turian-log">
              {msgs.map((m, i) => (
                <div key={i} className={`turian-msg ${m.who}`}>
                  <div className="bubble">{m.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={send} className="turian-entry">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask Turian about Worlds, Zones, or Navatar…"
              />
              <button className="btn-primary">Send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
