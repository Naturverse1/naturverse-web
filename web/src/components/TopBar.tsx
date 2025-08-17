import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function getTotalCoins(): number {
  // Sum all nv::coins keys like we did in the shop util
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    if (/^nv:.*:coins$/.test(k)) total += Number(localStorage.getItem(k) || 0);
  }
  return total - Number(localStorage.getItem("nv:spent:coins") || 0);
}

export default function TopBar() {
  const [coins, setCoins] = useState(getTotalCoins());
  const loc = useLocation();
  useEffect(() => {
    const i = setInterval(() => setCoins(getTotalCoins()), 800);
    return () => clearInterval(i);
  }, []);
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: "rgba(3,10,20,.55)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <Link to="/" style={{ fontWeight: 800, letterSpacing: ".02em" }}>
        Naturverse
      </Link>
      <div style={{ marginLeft: "auto" }} />
      <Link to="/zones/arcade" style={{ opacity: 0.9 }}>
        Arcade
      </Link>
      <Link to="/zones/arcade/shop" style={{ opacity: 0.9 }}>
        Shop
      </Link>
      <span
        style={{
          padding: "4px 10px",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 999,
        }}
      >
        🪙 {coins}
      </span>
    </div>
  );
}
