import { Link } from "react-router-dom";

const cards = [
  { to: "/worlds", title: "Worlds", desc: "Travel the 14 magical kingdoms.", emoji: "🗺️" },
  { to: "/zones", title: "Zones", desc: "Arcade, Music, Wellness, Creator Lab, Stories, Quizzes.", emoji: "🕹️🎵🧘" },
  { to: "/marketplace", title: "Marketplace", desc: "Wishlist, catalog, checkout, NATUR coin.", emoji: "🧺" },
  { to: "/naturversity", title: "Naturversity", desc: "Teachers, partners, courses.", emoji: "🎓" },
  { to: "/naturbank", title: "Naturbank", desc: "Wallets, $NATUR token, NFTs, crypto basics.", emoji: "🪙" },
  { to: "/navatar", title: "Navatar", desc: "Create your character & card.", emoji: "🧩" },
  { to: "/passport", title: "Passport", desc: "Stamps, badges, XP & coins.", emoji: "🛂" },
  { to: "/turian", title: "Turian", desc: "AI guide for tips & quests.", emoji: "🦉" },
  { to: "/profile", title: "Profile", desc: "Your account & saved navatar.", emoji: "👤" }
];

export default function Home() {
  return (
    <section>
      <h1>✨ Welcome to the Naturverse™</h1>
      <p className="subhead">Pick a hub to begin your adventure.</p>
      <div className="grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card">
            <div className="card-emoji" aria-hidden>{c.emoji}</div>
            <div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
