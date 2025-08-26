import React from "react";

export function toast(msg: string) {
  const el = document.createElement("div");
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)",
    background: "#2f6dfc", color: "#fff", padding: "10px 14px", borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(31,74,207,.25)", fontWeight: 800, zIndex: 9999
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

export default function ToasterListener() {
  React.useEffect(() => {
    const onGrant = () => toast("Stamp earned!");
    window.addEventListener("natur:stamp-granted", onGrant);
    return () => window.removeEventListener("natur:stamp-granted", onGrant);
  }, []);
  return null;
}
