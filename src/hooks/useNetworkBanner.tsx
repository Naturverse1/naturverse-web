import React from "react";

export function useNetworkBanner() {
  const [offline, setOffline] = React.useState(!navigator.onLine);
  React.useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return offline;
}

export function NetworkBanner() {
  const offline = useNetworkBanner();
  if (!offline) return null;
  return (
    <div style={{
      position:"fixed", top:0, left:0, right:0, zIndex:9998,
      background:"#2b64ff", color:"#fff", padding:"8px 12px",
      textAlign:"center", fontWeight:700
    }}>
      You’re offline — showing cached content.
    </div>
  );
}
