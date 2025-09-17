import { useEffect, useRef, useState } from 'react';
import './turian.css';

type Msg = { role: 'user'|'bot'|'notice'; text: string };

export function TurianChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: "Heya! I'm Turian the Durian, your cheerful Naturverse guide. Ask for quests, tips, or fun facts and I'll keep it light!" }
  ]);
  const [input, setInput] = useState('');
  const [online, setOnline] = useState<boolean>(true); // toggled by pinging the function
  const [busy, setBusy] = useState(false);
  const view = useRef<HTMLDivElement>(null);

  // simple heartbeat to decide ONLINE/OFFLINE badge
  useEffect(() => {
    const ping = async () => {
      try {
        const r = await fetch('/.netlify/functions/turian-chat-ping');
        setOnline(r.ok);
      } catch { setOnline(false); }
    };
    ping();
  }, []);

  useEffect(() => {
    view.current?.scrollTo({ top: view.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  const ask = async () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setBusy(true);

    try {
      const r = await fetch('/.netlify/functions/turian-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q })
      });
      if (!r.ok) throw new Error('offline');
      const { reply } = await r.json();
      setMsgs(m => [...m, { role: 'bot', text: reply }]);
      setOnline(true);
    } catch {
      setOnline(false);
      setMsgs(m => [...m, { role: 'notice', text:
        "Offline mode engaged, yet I'm still bursting with jungle cheer. Ask about worlds, quests, or how to earn NATUR—I'll answer locally until the breeze returns."
      }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="turian-chat_card" aria-live="polite">
      <div className="turian-status" role="status">
        <span className={`turian-dot ${online ? 'turian-dot--online' : 'turian-dot--offline'}`} />
        <span>{online ? 'Online' : 'Offline mode'}</span>
      </div>

      <div ref={view} style={{maxHeight: 420, overflowY: 'auto', padding: 4}}>
        {msgs.map((m, i) => (
          <div key={i} className={`turian-msg turian-msg--${m.role}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="turian-composer">
        <input
          className="turian-input"
          placeholder="Ask Turian something..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => (e.key === 'Enter' ? ask() : null)}
          inputMode="text"
          aria-label="Message Turian"
        />
        <button className="turian-send" disabled={busy || !input.trim()} onClick={ask}>
          {busy ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default TurianChat;
