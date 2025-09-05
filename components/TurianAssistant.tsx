'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

function safelyHasSupabaseCookie(): boolean {
  if (typeof document === 'undefined') return false;
  try { return /(?:^|;\s)sb-/.test(document.cookie); } catch { return false; }
}

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const zone = useMemo(() => {
    if (typeof window === 'undefined') return 'home';
    const seg = window.location.pathname.replace(/^\/+/,'').split('/')[0] || 'home';
    return seg.toLowerCase();
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setMsgs((m) => [...m, { role: 'user', content: text }]);
    setSending(true);

    try {
      if (!safelyHasSupabaseCookie()) {
        const hint = `You're in ${zone[0].toUpperCase() + zone.slice(1)}.\nPlease **create an account** or **Continue with Google** to get started.`;
        setMsgs((m) => [...m, { role: 'assistant', content: hint }]);
        return;
      }

      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ zone, messages: [...msgs, { role: 'user', content: text }] }),
      });

      const data = res.ok ? await res.json() : null;
      const reply =
        data?.reply ??
        `You're in ${zone}. Ask me about “languages”, “courses”, or “shop”.`;
      setMsgs((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: 'assistant', content: `I couldn't reach the chat service. Try: "Where is languages?"` },
      ]);
    } finally {
      setSending(false);
    }
  }, [input, sending, zone, msgs]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button aria-label="Ask Turian" className="turian-btn" onClick={() => setOpen((v) => !v)}>
        <img src="/favicon-64x64.png" alt="" width={28} height={28} />
      </button>

      {open && (
        <div className="turian-drawer" role="dialog" aria-label="Ask Turian">
          <div className="turian-header">
            <strong>Ask Turian</strong>
            <button aria-label="Close" className="turian-close" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="turian-body">
            {msgs.length === 0 && <div className="turian-tip">Try: “Where is languages?”</div>}
            {msgs.map((m, i) => (
              <div key={i} className={`turian-msg ${m.role}`}>
                {m.role === 'user' ? 'You' : 'Turian'}: {m.content}
              </div>
            ))}
          </div>

          <div className="turian-inputrow">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask Turian…"
              disabled={sending}
            />
            <button className="turian-send" onClick={send} disabled={sending}>
              {sending ? '…' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

