import * as React from "react";

// Lazy load optional libs so build/SSR never crash if anything is missing
let copyToClipboard: ((text: string) => boolean) | null = null;
async function ensureCopyLib() {
  if (!copyToClipboard) {
    try {
      const mod = await import("copy-to-clipboard");
      copyToClipboard = mod.default;
    } catch {
      copyToClipboard = null;
    }
  }
}

export type ShareBlockProps = {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
};

export function ShareBlock({
  title = "Naturverse",
  text = "Come explore the Naturverse!",
  url = typeof window !== "undefined" ? window.location.href : "",
  className,
}: ShareBlockProps) {
  const [status, setStatus] = React.useState<string>("");

  async function webShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setStatus("Shared!");
        return;
      }
    } catch {
      // fallthrough to copy
    }
    // Fallback: copy the URL
    await ensureCopyLib();
    if (copyToClipboard && url) {
      copyToClipboard(url);
      setStatus("Link copied!");
    } else {
      setStatus("Copy unavailable");
    }
  }

  return (
    <div className={className ?? ""} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={webShare} className="btn btn-primary">
        Share
      </button>
      {status && (
        <span className="text-muted" aria-live="polite">
          {status}
        </span>
      )}
    </div>
  );
}

