'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatDrawer } from './ChatDrawer';
import { sendChat, type ChatMsg } from '../lib/chat';
import styles from './chat.module.css';

const TURION_EMOJI = '🟢';

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isMobile =
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 640px)').matches
      : false;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || busy) return;

    const next = [...msgs, { role: 'user', content: text.trim() } as ChatMsg];
    setMsgs(next);
    setText('');
    setBusy(true);

    const replied = await sendChat(next, path);
    setMsgs(replied.length ? replied : next);
    setBusy(false);

    if (isMobile) setTimeout(() => setOpen(false), 800);
  }

  return (
    <>
      <button
        className={styles.fab}
        aria-label='Open Turian assistant'
        onClick={() => setOpen(true)}
      >
        {TURION_EMOJI}
      </button>

      <ChatDrawer open={open} onClose={() => setOpen(false)}>
        <div className={styles.messages}>
          {msgs.length === 0 ? (
            <p className={styles.hint}>
              Ask me about Worlds, Zones, Naturversity, Marketplace, or Navatars.
            </p>
          ) : (
            msgs.map((m, i) => (
              <div key={i} className={`${styles.msg} ${styles[m.role]}`}>
                {m.content}
              </div>
            ))
          )}
          {busy && (
            <div className={`${styles.msg} ${styles.assistant}`}>Thinking…</div>
          )}
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder='Ask Turian…'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className={styles.send}
            disabled={busy || !text.trim()}
            aria-label='Send'
          >
            ↩︎
          </button>
        </form>
      </ChatDrawer>
    </>
  );
}
