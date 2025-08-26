import { smartShare } from "../utils/share";
import { useToast } from "./Toast";

export default function ShareButton({ title, text, url }: { title?: string; text?: string; url?: string; }) {
  const toast = useToast();
  return (
    <button
      className="btn share-btn"
      onClick={async () => {
        const res = await smartShare({ title, text, url });
        if (res === "shared") toast({ text: "Shared ✅", kind: "ok" });
        else if (res === "copied") toast({ text: "Link copied 📋", kind: "ok" });
        else if (res === "unsupported") toast({ text: "Sharing not supported", kind: "warn" });
        else toast({ text: "Share failed", kind: "err" });
      }}
    >
      Share
    </button>
  );
}
