import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Very light "are we logged in?" gate. Works with Supabase cookies.
// If you already have an auth hook/prop, replace this with your own.
function useIsAuthed(): boolean {
  // Supabase sets cookies like `sb-<project>-auth-token`.
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const hasSb = document.cookie
      .split('; ')
      .some((c) => c.startsWith('sb-') && c.includes('auth'));
    setAuthed(hasSb);
  }, []);
  return authed;
}

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

export default function TurianAssistant() {
  const isAuthed = useIsAuthed();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'system', content: 'Try: "Where is languages?"' },
  ]);
  const [input, setInput] = useState('');
  const body = typeof document !== 'undefined' ? document.body : null;
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on message change
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs, open]);

  // Don’t render anything at all if not signed in
  if (!isAuthed) return null;

  const ui = (
    <>
      {/* Floating Button */}
      <button
        aria-label='Ask Turian'
        className='turian-fab'
        onClick={() => setOpen(true)}
      >
        <img src='/favicon-64x64.png' alt='' className='turian-fab-img' />
      </button>

      {/* Dialog */}
      {open && (
        <div className='turian-root' role='dialog' aria-modal='true'>
          <div className='turian-card'>
            <div className='turian-header'>
              <img src='/favicon-64x64.png' alt='' className='turian-icon' />
              <div className='turian-title'>Ask Turian</div>
              <button
                aria-label='Close'
                className='turian-close'
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <div ref={listRef} className='turian-messages'>
              {msgs.map((m, i) => (
                <div key={i} className={`turian-msg ${m.role}`}>
                  {m.content}
                </div>
              ))}
            </div>

            <form
              className='turian-input-row'
              onSubmit={async (e) => {
                e.preventDefault();
                const text = input.trim();
                if (!text) return;
                setMsgs((m) => [...m, { role: 'user', content: text }]);
                setInput('');

                try {
                  const res = await fetch('/.netlify/functions/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      messages: [{ role: 'user', content: text }],
                    }),
                  });
                  const data = await res.json();
                  const reply =
                    data?.reply ??
                    data?.message ??
                    'Sorry, I didn’t catch that.';
                  setMsgs((m) => [
                    ...m,
                    { role: 'assistant', content: reply },
                  ]);
                } catch (err) {
                  setMsgs((m) => [
                    ...m,
                    {
                      role: 'assistant',
                      content: 'Hmm, something went wrong. Try again in a moment.',
                    },
                  ]);
                }
              }}
            >
              <input
                className='turian-input'
                placeholder='Ask Turian...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                // iOS zoom fix: keep >=16px (also enforced in CSS)
                inputMode='text'
              />
              <button className='turian-send' type='submit'>Send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return body ? createPortal(ui, body) : null;
}

