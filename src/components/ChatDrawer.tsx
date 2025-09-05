// src/components/ChatDrawer.tsx
import { useEffect, useRef } from 'react';
import styles from './assistant.module.css';

type Msg = { role: 'user'|'assistant'; content: string };
export default function ChatDrawer({
  open,
  onClose,
  messages,
  onSend,
  sending,
}: {
  open: boolean;
  onClose: () => void;
  messages: Msg[];
  onSend: (text: string) => void;
  sending: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = inputRef.current?.value?.trim();
      if (val) {
        onSend(val);
        inputRef.current!.value = '';
      }
    }
  };

  return (
    <div className={`${styles.drawer} ${open ? styles.open : ''}`} role="dialog" aria-label="Turian Assistant">
      <div className={styles.header}>
        <div className={styles.title}>Ask Turian</div>
        <div className={styles.headerButtons}>
          <button
            className={styles.minBtn}
            aria-label="Minimize"
            onClick={onClose}
          >
            ─
          </button>
          <button
            className={styles.closeBtn}
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.hint}>
            Try: “Where is Marketplace?” or “How do I create a Navatar?”
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? styles.user : styles.assistant}>
            {m.content}
          </div>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Ask Turian…"
          onKeyDown={onKey}
          disabled={sending}
        />
        <button
          className={styles.send}
          onClick={() => {
            const v = inputRef.current?.value?.trim();
            if (v) {
              onSend(v);
              inputRef.current!.value = '';
            }
          }}
          disabled={sending}
        >
          Send
        </button>
      </div>
    </div>
  );
}
