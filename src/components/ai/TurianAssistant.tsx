import { useState } from 'react';
import ChatDrawer from './ChatDrawer';
import '../../styles/assistant.css';

export default function TurianAssistant() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="turian-fab"
        aria-label="Open Turian assistant"
        onClick={() => setOpen(true)}
      >
        <img src="/favicon-32x32.png" alt="" />
      </button>
      <ChatDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
