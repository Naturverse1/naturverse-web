import { useEffect, useRef, useState } from 'react';
import { sendChat, type ChatMsg } from '../../lib/ai';
import '../../styles/assistant.css';

export default function ChatDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: 'assistant', content: 'Hi! I’m Turian 🦔 How can I help?' }]);
    }
  }, [open]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const text = inputRef.current?.value?.trim();
    if (!text) return;
    inputRef.current!.value = '';
    const next = [...msgs, { role: 'user', content: text }];
    setMsgs(next);
    setSending(true);
    try {
      const { reply } = await sendChat(next, path);
      setMsgs([...next, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMsgs([...next, { role: 'assistant', content: 'Hmm, I had trouble replying. Try again!' }]);
      console.warn(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`turian-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
      <header>
        <strong>Turian Assistant</strong>
        <button onClick={onClose} aria-label="Close">×</button>
      </header>
      <div className="msgs">
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.content}</div>
        ))}
      </div>
      <form onSubmit={onSend} className="composer">
        <input ref={inputRef} placeholder={sending ? 'Thinking…' : 'Ask me anything…'} disabled={sending} />
        <button disabled={sending}>Send</button>
      </form>
    </div>
  );
}
