import React from "react";

export default function VignetteOverlay() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background:
          "radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.04), transparent 60%), radial-gradient(1600px 900px at 50% 100%, rgba(0,0,0,0.35), transparent 60%)",
        mixBlendMode: "normal",
      }}
    />
  );
}
