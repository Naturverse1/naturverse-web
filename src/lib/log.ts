import { track } from "@/lib/analytics";

export async function log(level: "info"|"warn"|"error", message: string, meta?: any) {
  try {
    await fetch("/.netlify/functions/log", {
      method: "POST", headers: { "content-type":"application/json" },
      body: JSON.stringify({ level, message, meta })
    });
  } catch {}
}

export function installGlobalLogCapture() {
  window.addEventListener("error", (e) => {
    track("client_error");
    log("error", e.message || "window.error", { source: e.filename, line: e.lineno, col: e.colno });
  });
  window.addEventListener("unhandledrejection", (e) => {
    track("client_error");
    log("error", "unhandledrejection", { reason: String((e as any).reason) });
  });
}
