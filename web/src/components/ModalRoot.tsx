import React, { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalRoot({ open, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    const prev = document.activeElement as HTMLElement | null;
    const focusEl = ref.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusEl?.focus();

    return () => {
      window.removeEventListener('keydown', handleKey);
      prev?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-root"
      role="dialog"
      aria-modal="true"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 1000,
      }}
    >
      <div ref={ref} style={{ outline: 'none', width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
