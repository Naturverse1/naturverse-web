import React, { useEffect, useState } from 'react';
import type { ToastType } from './useToast';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  timeout?: number;
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = (id: number) =>
    setToasts((all) => all.filter((t) => t.id !== id));

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Toast>).detail;
      const toast: Toast = {
        id: Date.now() + Math.random(),
        ...detail,
      };
      setToasts((all) => [...all, toast]);
      if (toast.timeout !== 0) {
        setTimeout(() => dismiss(toast.id), toast.timeout || 4000);
      }
    };
    window.addEventListener('nv_toast', handler);
    return () => window.removeEventListener('nv_toast', handler);
  }, []);

  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.message}</span>
          <button onClick={() => dismiss(t.id)} aria-label="Close">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
