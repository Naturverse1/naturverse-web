import { useEffect, useState } from 'react';
import ChatDrawer from './ChatDrawer';
import styles from './assistant.module.css';
import { sendChat, ChatMsg } from '../lib/chat';

function detectZone(pathname: string): string {
  if (pathname.startsWith('/naturversity')) return 'naturversity';
  if (pathname.startsWith('/marketplace')) return 'marketplace';
  if (pathname.startsWith('/navatar')) return 'navatar';
  return 'home';
}

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Array<{ role:'user'|'assistant'; content:string }>>([]);

  // 🛠️ IMPORTANT: initialize safely for SSR/prerender
  const [zone, setZone] = useState<'home'|'naturversity'|'marketplace'|'navatar'>('home');

  useEffect(() => {
    // Only touch window in an effect
    try {
      const path = typeof window !== 'undefined' ? window.location.pathname : '/';
      setZone(detectZone(path) as any);
    } catch {
      setZone('home');
    }
  }, []);

  async function handleSend(text: string) {
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setSending(true);
    try {
      const reply = await sendChat(next as ChatMsg[], zone);
      setMessages([...next, { role: 'assistant', content: reply }]);
      if (typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches) {
        setTimeout(() => setOpen(false), 500);
      }
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Sorry—something went wrong. Try again.' }]);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <>
      <button
        className={styles.float}
        aria-label="Open Turian assistant"
        onClick={() => setOpen(true)}
      >
        <img src="/turian-emoji-64.png" alt="" className={styles.icon} />
      </button>

      <ChatDrawer
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        onSend={handleSend}
        sending={sending}
      />
    </>
  );
}

