import React from "react";

const toastStyle: React.CSSProperties = {
  position: "fixed", bottom: 16, left: 16, right: 16, zIndex: 9999,
  display: "flex", gap: 12, alignItems: "center",
  background: "white", color: "#0b2545", padding: "12px 14px",
  borderRadius: 14, boxShadow: "0 12px 30px rgba(0,0,0,.12)"
};
const btnStyle: React.CSSProperties = {
  marginLeft: "auto", background: "#2b64ff", color: "white",
  border: "none", borderRadius: 12, padding: "8px 12px", fontWeight: 700, cursor: "pointer"
};

export default function PwaToasts() {
  const [needRefresh, setNeedRefresh] = React.useState(false);
  const [offlineReady, setOfflineReady] = React.useState(false);

  React.useEffect(() => {
    const nr = () => setNeedRefresh(true);
    const or = () => setOfflineReady(true);
    window.addEventListener('pwa:need-refresh', nr);
    window.addEventListener('pwa:offline-ready', or);
    return () => {
      window.removeEventListener('pwa:need-refresh', nr);
      window.removeEventListener('pwa:offline-ready', or);
    };
  }, []);

  if (!needRefresh && !offlineReady) return null;

  return (
    <div style={toastStyle} role="status" aria-live="polite">
      {needRefresh && (
        <>
          <span>New version ready.</span>
          <button style={btnStyle} onClick={() => location.reload()}>Refresh</button>
        </>
      )}
      {offlineReady && !needRefresh && (
        <span>Offline ready — you can use Naturverse without internet.</span>
      )}
    </div>
  );
}
