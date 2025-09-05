import { useEffect, useRef } from "react";

export function ChatDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  // Close on outside click / escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const el = boxRef.current;
      if (el && !el.contains(e.target as Node)) onClose();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  return (
    <div className={`tv-chat ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="tv-chat-box" ref={boxRef} role="dialog" aria-label="Turian chat">
        <button className="tv-close" aria-label="Close chat" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
