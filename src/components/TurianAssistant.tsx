import { useEffect, useMemo, useState } from 'react';
import ChatDrawer from './ChatDrawer';
import styles from './assistant.module.css';
import { sendChat, type ChatMsg } from '../lib/chat';
import BrandMark from './BrandMark';

type Zone = 'home' | 'naturversity' | 'marketplace' | 'navatar';

function detectZone(path: string): Zone {
  if (path.startsWith('/naturversity')) return 'naturversity';
  if (path.startsWith('/marketplace'))  return 'marketplace';
  if (path.startsWith('/navatar'))      return 'navatar';
  return 'home';
}

export default function TurianAssistant() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [zone, setZone] = useState<Zone>('home');
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  useEffect(() => {
    setMounted(true); // avoid SSR mismatch
    try {
      setZone(detectZone(window.location.pathname));
    } catch { /* no-op */ }
  }, []);

  const placeholder = useMemo(() => 'Ask Turian…', []);

  async function handleSend(text: string) {
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setSending(true);
    try {
      const reply = await sendChat(next, zone);
      setMessages([...next, { role: 'assistant', content: reply }]);
      // Auto collapse on small screens after a short delay
      if (window.matchMedia('(max-width: 640px)').matches) {
        setTimeout(() => setOpen(false), 600);
      }
    } catch {
      setMessages([
        ...next,
        { role: 'assistant', content: 'Sorry—something went wrong. Try again.' },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (!mounted) return null;

  return (
    <>
      <button
        className={styles.float}
        aria-label="Open Turian assistant"
        onClick={() => setOpen(true)}
      >
        <span className={styles.iconWrap} aria-hidden>
          <BrandMark />
        </span>
      </button>

      <ChatDrawer
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        onSend={handleSend}
        sending={sending}
        placeholder={placeholder}
      />
    </>
  );
}

