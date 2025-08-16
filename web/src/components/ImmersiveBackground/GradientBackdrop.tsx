import React from "react";

export default function GradientBackdrop() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -3,
        background:
          "radial-gradient(1200px 800px at 20% 10%, rgba(62,132,199,0.35), transparent 60%), radial-gradient(1000px 700px at 80% 30%, rgba(119,201,146,0.35), transparent 60%), linear-gradient(180deg, #0b1220 0%, #0a0f1a 60%, #090e18 100%)",
      }}
    />
  );
}
