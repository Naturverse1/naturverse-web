import { useEffect, useRef, useState, FormEvent } from 'react';
import styles from './assistant.module.css';
import type { ChatMsg } from '../lib/chat';

type Props = {
  open: boolean;
  onClose: () => void;
  messages: ChatMsg[];
  onSend: (text: string) => void;
  sending: boolean;
};

export default function ChatDrawer({ open, onClose, messages, onSend, sending }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) {
      setText('');
      inputRef.current?.focus();
    }
  }, [open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value || sending) return;
    onSend(value);
    setText('');
  }

  return (
    <div className={`${styles.drawer} ${open ? styles.open : ''}`} role="dialog" aria-modal="true">
      <button className={styles.close} aria-label="Close" onClick={onClose}>
        &times;
      </button>
      <div className={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? styles.user : styles.assistant}>
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={sending}
          placeholder="Ask me anything"
        />
      </form>
    </div>
  );
}

