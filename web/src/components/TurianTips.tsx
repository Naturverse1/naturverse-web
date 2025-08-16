import React, { useEffect, useState } from "react";
import useReducedMotion from "@/hooks/useReducedMotion";

const localTips = [
  "Try a 60-second nature breath.",
  "Spot three leaf shapes today.",
  "Ask a 'why' about any animal!",
  "Draw your tiny world."
];

export default function TurianTips() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(() => localStorage.getItem("show-tips") !== "false");
  const [tips, setTips] = useState<string[]>(localTips);
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const handler = () => setShow(localStorage.getItem("show-tips") !== "false");
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    if (!show) return;
    const schedule = (cb: () => void) =>
      ("requestIdleCallback" in window
        ? (window as any).requestIdleCallback(cb)
        : setTimeout(cb, 200));
    schedule(async () => {
      try {
        const resp = await fetch("/.netlify/functions/generate-tips", { method: "POST" });
        const data = await resp.json();
        if (Array.isArray(data.tips) && data.tips.length) {
          setTips(data.tips);
        } else {
          setTips(localTips);
        }
      } catch {
        setTips(localTips);
      }
    });
  }, [show]);

  useEffect(() => {
    if (reduced || tips.length <= 1) return;
    const id = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % tips.length);
        setFade(false);
      }, 250);
    }, 8000);
    return () => clearInterval(id);
  }, [reduced, tips]);

  if (!show) return null;

  return (
    <div className="mx-auto mt-4 w-full max-w-[720px] rounded-lg border border-white/10 bg-black/40 p-4 text-white">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white/90">
        <span role="img" aria-label="Turian">🍈</span>
        <span>Turian says</span>
      </div>
      <p
        aria-live="polite"
        className={`${fade && !reduced ? "opacity-0" : "opacity-100"}`}
        style={{ transition: reduced ? "none" : "opacity 250ms" }}
      >
        {tips[idx]}
      </p>
    </div>
  );
}

