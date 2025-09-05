'use client';

import { useEffect, useRef, useState } from 'react';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape and on outside click
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onEsc);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const prompt = text.trim();
    if (!prompt || sending) return;

    const next = [...messages, { role: 'user', content: prompt }];
    setMessages(next);
    setText('');
    setSending(true);

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });

      let replyText = 'Thanks! (demo reply)';
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        // accept several shapes ('reply', 'message', or {role,content})
        if (typeof data?.reply === 'string') replyText = data.reply;
        else if (typeof data?.message === 'string') replyText = data.message;
        else if (Array.isArray(data?.messages)) {
          const last = data.messages[data.messages.length - 1];
          if (last?.content) replyText = String(last.content);
        }
      } else {
        // fall back gracefully
        replyText = 'Something went wrong.';
      }

      setMessages([...next, { role: 'assistant', content: replyText }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Something went wrong.' }]);
    } finally {
      setSending(false);
      // Auto-collapse on mobile after reply
      if (window.matchMedia('(max-width: 768px)').matches) setOpen(false);
    }
  }

  // Basic styles (no external CSS required)
  const btnStyle: React.CSSProperties = {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '2px solid #9bbcff',
    background: '#fff',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: '16px',
    bottom: '72px',
    width: 'min(360px, 90vw)',
    maxHeight: '50vh',
    background: '#fff',
    border: '2px solid #d6e0ff',
    borderRadius: '12px',
    boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
    padding: '12px',
    display: open ? 'flex' : 'none',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 1000,
  };

  const listStyle: React.CSSProperties = {
    overflowY: 'auto',
    padding: '6px',
    borderRadius: '8px',
    background: '#f8faff',
    border: '1px solid #eef3ff',
    maxHeight: '30vh',
  };

  const inputRow: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1.5px solid #c9d6ff',
    outline: 'none',
  };

  const sendStyle: React.CSSProperties = {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid #2b6cff',
    background: '#2b6cff',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  };

  const closeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '6px',
    right: '8px',
    fontSize: '18px',
    lineHeight: 1,
    cursor: 'pointer',
    color: '#2b6cff',
    background: 'transparent',
    border: 'none',
  };

  return (
    <>
      {/* Panel */}
      <div ref={panelRef} style={panelStyle} role="dialog" aria-label="Turian assistant">
        <button style={closeStyle} aria-label="Close" onClick={() => setOpen(false)}>
          ×
        </button>

        <div style={listStyle}>
          {messages.length === 0 && (
            <div style={{ color: '#3b5dff' }}>Ask Turian anything about the site.</div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong>{m.role === 'user' ? 'You' : 'Turian'}: </strong>
              <span>{m.content}</span>
            </div>
          ))}
        </div>

        <form style={inputRow} onSubmit={send}>
          <input
            style={inputStyle}
            placeholder="Ask Turian…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
          />
          <button type="submit" style={sendStyle} disabled={sending}>
            {sending ? '…' : 'Send'}
          </button>
        </form>
      </div>

      {/* Floating button */}
      <button
        type="button"
        style={btnStyle}
        aria-label="Open Turian assistant"
        onClick={() => setOpen((v) => !v)}
      >
        {/* simple emoji/initial so no binary asset required */}
        <span style={{ fontSize: 22 }}>🟢</span>
      </button>
    </>
  );
}

