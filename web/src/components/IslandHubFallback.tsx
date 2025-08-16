import React from "react";

export default function IslandHubFallback() {
  return (
    <div
      style={{
        width: "100%",
        height: 360,
        borderRadius: 16,
        display: "grid",
        placeItems: "center",
        color: "#cfe9ff",
        background:
          "radial-gradient(1000px 600px at 10% -10%, rgba(251, 241, 146, 0.06), transparent 60%), radial-gradient(900px 700px at 110% 0%, rgba(36, 180, 70, 0.08), transparent 55%), linear-gradient(108deg, #0b1028, #101a38 55%)",
        boxShadow: "0 20px 60px rgba(0,0,0,.25)"
      }}
    >
      <div style={{ opacity: 0.8 }}>Loading the 3D Island…</div>
    </div>
  );
}
