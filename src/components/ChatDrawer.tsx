import { useEffect, useRef } from 'react';
import styles from './assistant.module.css';
import type { ChatMsg } from '../lib/chat';

export default function ChatDrawer({
  open,
  onClose,
  messages,
  onSend,
  sending,
  placeholder,
}: {
  open: boolean;
  onClose: () => void;
  messages: ChatMsg[];
  onSend: (text: string) => void;
  sending: boolean;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <div className={`${styles.drawer} ${open ? styles.open : ''}`} role="dialog" aria-modal="true">
      <button className={styles.close} aria-label="Close" onClick={onClose}>×</button>

      <div className={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? styles.user : styles.bot}>
            {m.content}
          </div>
        ))}
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          const val = inputRef.current?.value?.trim();
          if (!val) return;
          onSend(val);
          if (inputRef.current) inputRef.current.value = '';
        }}
      >
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder={placeholder}
          aria-label="Message Turian"
        />
        <button className={styles.send} disabled={sending} type="submit">
          {sending ? '…' : 'Send'}
        </button>
      </form>
    </div>
  );
}

