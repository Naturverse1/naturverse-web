import { useEffect, useRef, useState } from 'react';
import { chat, type ChatMessage } from '../../lib/ai';
import '../../styles/assistant.css';

export default function ChatDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I’m Turian. Ask me about whatever’s on this page.' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => scrollRef.current?.scrollTo(0, 999999), 0);
  }, [open, messages.length]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    try {
      const reply = await chat(next, { path: window.location.pathname });
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages([...next, { role: 'assistant', content: `Error: ${err?.message ?? err}` }]);
    }
  }

  if (!open) return null;

  return (
    <section className="turian-drawer" role="dialog" aria-label="Turian assistant">
      <div className="turian-header">
        <div className="turian-title">
          <img src="/favicon-32x32.png" alt="" width={20} height={20} />
          Turian Assistant
        </div>
        <button onClick={onClose} aria-label="Close">Close ✕</button>
      </div>

      <div ref={scrollRef} className="turian-body">
        {messages.map((m, i) => (
          <div key={i} className={`turian-msg ${m.role === 'user' ? 'me' : 'ai'}`}>{m.content}</div>
        ))}
      </div>

      <form
        className="turian-input"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this page, navigation, or features…"
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
