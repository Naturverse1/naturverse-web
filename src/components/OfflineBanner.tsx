import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      style={{
        background: "#fffae6",
        color: "#5b4600",
        borderBottom: "1px solid #ffe58f",
        padding: "6px 12px",
        textAlign: "center",
        fontWeight: 600,
      }}
    >
      You’re offline. Changes may not save until you reconnect.
    </div>
  );
}
