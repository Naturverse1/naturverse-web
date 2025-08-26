import { createContext, useContext, useEffect, useState } from "react";

type ToastMsg = { id: number; text: string; kind?: "ok" | "warn" | "err" };
const Ctx = createContext<(msg: Omit<ToastMsg, "id">) => void>(() => {});

export function useToast() { return useContext(Ctx); }

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastMsg[]>([]);
  const push = (m: Omit<ToastMsg, "id">) => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, ...m }]);
    setTimeout(() => setItems((x) => x.filter(i => i.id !== id)), 2200);
  };
  return (
    <Ctx.Provider value={push}>
      {children}
      <div style={{
        position: "fixed", bottom: 18, left: 0, right: 0, display: "grid",
        placeItems: "center", pointerEvents: "none", zIndex: 9999
      }}>
        {items.map(t => (
          <div key={t.id} role="status" aria-live="polite"
               style={{
                 pointerEvents: "auto",
                 background: t.kind==="err"?"#fde7e7":t.kind==="warn"?"#fff4d6":"#e8f1ff",
                 color: t.kind==="err"?"#7a1e1e":t.kind==="warn"?"#5f4b00":"#0b2545",
                 border: "1px solid rgba(0,0,0,.08)", padding: "10px 14px",
                 borderRadius: 10, boxShadow: "0 8px 18px rgba(0,0,0,.08)"
               }}>
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
