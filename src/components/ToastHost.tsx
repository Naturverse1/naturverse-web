import React, { useEffect, useState } from "react";

type Toast = { id: number; text: string };
export default function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const add = (e: any) => {
      const text = e.detail?.text || "Done";
      const id = Date.now();
      setToasts((t) => [...t, { id, text }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
    };
    window.addEventListener("nv:toast", add as any);
    return () => window.removeEventListener("nv:toast", add as any);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        display: "grid",
        gap: 8,
        zIndex: 70,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: "#111827",
            color: "white",
            padding: "10px 14px",
            borderRadius: 10,
            boxShadow: "0 6px 20px rgba(0,0,0,.25)",
          }}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
