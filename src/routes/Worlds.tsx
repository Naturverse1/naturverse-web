import { Link } from "react-router-dom";

const WORLDS = [
  { slug: "thailandia", name: "Thailandia", subtitle: "Coconuts & Elephants", emoji: "🐘🥥" },
  { slug: "chinlandia", name: "Chinlandia", subtitle: "Bamboo & Pandas", emoji: "🐼🎋" },
  { slug: "indilandia", name: "Indilandia", subtitle: "Mangoes & Tigers", emoji: "🐅🥭" },
  { slug: "brazilandia", name: "Brazilandia", subtitle: "Bananas & Parrots", emoji: "🦜🍌" },
  { slug: "amerilandia", name: "Amerilandia", subtitle: "Apples & Eagles", emoji: "🦅🍎" },
  { slug: "australandia", name: "Australandia", subtitle: "Peaches & Kangaroos", emoji: "🦘🍑" },
];

export default function Worlds() {
  return (
    <>
      <h2>Worlds</h2>
      <ul className="cards">
        {WORLDS.map(w => (
          <li key={w.slug} className="card">
            <Link to={`/worlds/${w.slug}`} className="card-link">
              <div className="card-emoji">{w.emoji}</div>
              <div>
                <div className="card-title">{w.name}</div>
                <div className="card-sub">{w.subtitle}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

