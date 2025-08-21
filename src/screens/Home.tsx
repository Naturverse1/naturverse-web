import React from "react";
import { Link } from "react-router-dom";

const hubs = [
  { to:"/worlds", icon:"📚", title:"Worlds", blurb:"Travel the 14 magical kingdoms." },
  { to:"/zones", icon:"🎮🎵🧘", title:"Zones", blurb:"Arcade, Music, Wellness, Creator Lab, Stories, Quizzes." },
  { to:"/marketplace", icon:"👜", title:"Marketplace", blurb:"Wishlist, catalog, checkout, NATUR coin." },
  { to:"/naturversity", icon:"🎓", title:"Naturversity", blurb:"Teachers, partners, courses." },
  { to:"/naturbank", icon:"🪙", title:"Naturbank", blurb:"Wallets, $NATUR token, NFTs, crypto basics." },
  { to:"/navatar", icon:"🧩", title:"Navatar", blurb:"Create your character & card." },
  { to:"/passport", icon:"📘", title:"Passport", blurb:"Stamps, badges, XP & coins." },
  { to:"/turian", icon:"🦉", title:"Turian", blurb:"AI guide for tips & quests." },
  { to:"/profile", icon:"🙋", title:"Profile", blurb:"Your account & saved navatar." },
];

export default function Home() {
  return (
    <section>
      <h1 className="h1">✨ Welcome to the Naturverse™</h1>
      <p className="p">Pick a hub to begin your adventure.</p>
      <div className="grid">
        {hubs.map(h=>(
          <Link to={h.to} key={h.to} className="card">
            <h3>{h.icon} {h.title}</h3>
            <div className="small">{h.blurb}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
