import React from "react";

/**
 * Minimal crash UI shown by the GlobalErrorBoundary.
 * Includes a one-click way to unregister SWs, clear caches & storage, and reload.
 */
export default function ErrorFallback({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const message =
    error instanceof Error ? `${error.name}: ${error.message}` : String(error ?? "Unknown error");

  async function clearAndReload() {
    try {
      // Unregister any service workers
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.allSettled(regs.map((r) => r.unregister()));
      }
      // Clear Cache Storage
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.allSettled(keys.map((k) => caches.delete(k)));
      }
      // Clear local/session storage (best-effort)
      try { localStorage.clear(); } catch {}
      try { sessionStorage.clear(); } catch {}

      // Force a reload from network
      location.reload();
    } catch (e) {
      console.error("[naturverse] clearAndReload failed", e);
      // Still try to reload
      location.reload();
    }
  }

  return (
    <div style={wrapper}>
      <div style={card}>
        <h1 style={{ margin: 0 }}>Something went wrong</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          The page crashed during startup. You can try reloading, or clear cached data and reload.
        </p>

        <pre style={pre} aria-label="Error details">{message}</pre>

        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <button onClick={() => location.reload()} style={btn}>Reload</button>
          <button onClick={clearAndReload} style={btn}>Clear cache & reload</button>
          {onRetry && <button onClick={onRetry} style={btnOutline}>Retry render</button>}
        </div>
      </div>
    </div>
  );
}

const wrapper: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f6f8ff",
  padding: 16,
};

const card: React.CSSProperties = {
  width: "min(720px, 92vw)",
  background: "#fff",
  border: "1px solid #e4e7f1",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  borderRadius: 12,
  padding: 16,
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
};

const pre: React.CSSProperties = {
  background: "#0b1020",
  color: "#eff2ff",
  padding: 12,
  borderRadius: 8,
  overflow: "auto",
  maxHeight: 240,
  fontSize: 12.5,
  lineHeight: 1.4,
  marginTop: 12,
};

const btn: React.CSSProperties = {
  appearance: "none",
  border: "none",
  borderRadius: 8,
  padding: "10px 14px",
  background: "#0ea5e9",
  color: "#fff",
  cursor: "pointer",
};

const btnOutline: React.CSSProperties = {
  ...btn,
  background: "transparent",
  color: "#0ea5e9",
  border: "1px solid #0ea5e9",
};
