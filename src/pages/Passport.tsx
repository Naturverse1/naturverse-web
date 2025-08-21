import React, { useMemo, useState } from "react";
import { getCurrent } from "../lib/navatar/store";
import type { Badge } from "../lib/passport/store";
import { getStamps, toggleStamp, getBadges, addBadge, getXP, addXP, getNatur, addNatur } from "../lib/passport/store";

const KINGDOMS = [
  "Thailandia","Brazilandia","Indilandia","Amerilandia",
  "Australandia","Chilandia","Japonica","Africania",
  "Europalia","Britannula","Kiwilandia","Madagascaria",
  "Greenlandia","Antarcticland"
];

export default function PassportPage() {
  const nav = getCurrent();
  const [stamps, setStamps] = useState<string[]>(getStamps());
  const [badges, setBadges] = useState<Badge[]>(getBadges());
  const [xp, setXp] = useState(getXP());
  const [natur, setNatur] = useState(getNatur());

  const stampCount = stamps.length;
  const level = useMemo(() => 1 + Math.floor(xp / 100), [xp]);

  const onToggle = (k: string) => { toggleStamp(k); setStamps(getStamps()); };
  const demoBadge = () => {
    addBadge({ id: "first-tour", title: "First Tour", emoji: "🗺️", desc: "Visited your first kingdom." });
    setBadges(getBadges());
  };
  const earnXP = (n: number) => { addXP(n); setXp(getXP()); };
  const earnNatur = (n: number) => { addNatur(n); setNatur(getNatur()); };

  return (
    <div>
      <h1>Passport</h1>
      <p>Badges, stamps, XP, and NATUR coin.</p>

      {/* Identity / Navatar */}
      <div className="passport-id">
        <div className="avatar">
          {nav?.photo ? <img src={nav.photo} alt="" /> : <span className="emoji">{nav?.emoji || "🪪"}</span>}
        </div>
        <div className="id-text">
          <div className="name">{nav?.name || "Explorer"}</div>
          <div className="muted">{nav ? `${nav.base} · ${nav.species}` : "Create a Navatar to personalize."}</div>
        </div>
        <div className="stats">
          <div className="stat"><div className="k">Level</div><div className="v">{level}</div></div>
          <div className="stat"><div className="k">XP</div><div className="v">{xp}</div></div>
          <div className="stat"><div className="k">NATUR</div><div className="v">{natur}</div></div>
        </div>
      </div>

      <div className="row gap">
        <button className="btn tiny" onClick={() => earnXP(10)}>+10 XP</button>
        <button className="btn tiny" onClick={() => earnNatur(5)}>+5 NATUR</button>
        <button className="btn tiny outline" onClick={demoBadge}>Award Demo Badge</button>
      </div>

      {/* Stamps */}
      <h2 className="mt">Stamps</h2>
      <p className="muted">Tap a kingdom to toggle a stamp. ({stampCount}/14)</p>
      <div className="stamps-grid">
        {KINGDOMS.map(k => {
          const on = stamps.includes(k);
          return (
            <button key={k} className={"stamp" + (on ? " on" : "")} onClick={() => onToggle(k)} aria-pressed={on}>
              <span className="dot">{on ? "✅" : "⬜️"}</span>
              <span>{k}</span>
            </button>
          );
        })}
      </div>

      {/* Badges */}
      <h2 className="mt">Badges</h2>
      {badges.length === 0 ? (
        <p className="muted">No badges yet. Complete quests to earn some!</p>
      ) : (
        <div className="badges">
          {badges.map(b => (
            <div className="badge" key={b.id} title={b.desc}>
              <div className="emoji">{b.emoji}</div>
              <div className="title">{b.title}</div>
              <div className="desc">{b.desc}</div>
            </div>
          ))}
        </div>
      )}

      <p className="meta">Coming soon: travel logs, per-kingdom progress, leaderboard, wallet-linked NATUR ledger, and verifiable stamp NFTs.</p>
    </div>
  );
}
