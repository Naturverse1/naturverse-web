import { FormEvent, useState } from 'react';
import { sendTurianMessage } from '../../lib/ai';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChatDrawer({ open, onClose }: Props) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const msg = input.trim();
    if (!msg) return;
    setMessages((m) => [...m, msg]);
    setInput('');
    try {
      const reply = await sendTurianMessage(msg);
      setMessages((m) => [...m, reply]);
    } catch {
      setMessages((m) => [...m, 'Something went wrong.']);
    }
  }

  return (
    <div className="turian-drawer" role="dialog" aria-label="Turian assistant">
      <button className="turian-close" aria-label="Close" onClick={onClose}>
        ×
      </button>
      <div className="turian-messages">
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="turian-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Turian..."
        />
      </form>
    </div>
  );
}
