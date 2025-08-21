import React from "react";
import { Link } from "react-router-dom";

const tiles = [
  { href: "/naturbank/wallet", emoji: "🪪", title: "Wallet", desc: "Create custodial wallet & view address." },
  { href: "/naturbank/token",  emoji: "🪙", title: "NATUR Token", desc: "Earnings, redemptions, and ledger." },
  { href: "/naturbank/nfts",   emoji: "🖼️", title: "NFTs", desc: "Mint navatar cards & collectibles." },
  { href: "/naturbank/learn",  emoji: "📘", title: "Learn", desc: "Crypto basics & safety guides." },
];

export default function Naturbank() {
  return (
    <div>
      <h1>Naturbank</h1>
      <div className="hub-grid">
        {tiles.map(t => (
          <Link key={t.href} className="hub-card" to={t.href}>
            <div className="emoji">{t.emoji}</div>
            <div className="title">{t.title}</div>
            <div className="desc">{t.desc}</div>
          </Link>
        ))}
      </div>
      <p className="meta">Coming soon: live wallets, on-chain mints, and payouts.</p>
    </div>
  );
}
