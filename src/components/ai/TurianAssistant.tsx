import { useState } from 'react';
import ChatDrawer from './ChatDrawer';
import '../../styles/assistant.css';

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="turian-fab"
        aria-label="Open assistant"
        data-testid="turian-fab"
        style={{
          position: 'fixed',
          right: '1rem',
          bottom: '1rem',
          zIndex: 10000,
          border: '2px solid var(--nv-blue-300)',
          background: '#fff',
          borderRadius: '999px',
          width: 56,
          height: 56,
        }}
        onClick={() => setOpen(true)}
      >
        <img src="/favicon-32x32.png" alt="" width={24} height={24} />
      </button>
      <ChatDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
