'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './chat.module.css';

export function ChatDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const el = boxRef.current;
      if (el && !el.contains(e.target as Node)) onClose();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open, onClose]);

  return (
    <div className={`${styles.chat} ${open ? styles.open : ''}`} aria-hidden={!open}>
      <div className={styles.box} ref={boxRef} role="dialog" aria-label="Turian chat">
        <button className={styles.close} aria-label="Close chat" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
