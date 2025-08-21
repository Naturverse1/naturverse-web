import { Link } from "react-router-dom";
import { WORLDS } from "../../data/worlds";
import "./Worlds.css";

export default function Worlds() {
  return (
    <main className="container">
      <div className="breadcrumb">Home / Worlds</div>
      <h2 className="section-title">Worlds</h2>
      <p className="section-lead">Explore the 14 kingdoms.</p>

      <div className="grid">
        {WORLDS.map((w) => (
          <Link key={w.id} to={`/worlds/${w.id}`} className="card world-card">
            {w.img ? (
              <img src={w.img} alt="" className="world-thumb" />
            ) : (
              <span className="emoji" aria-hidden>{w.emoji}</span>
            )}
            <div>
              <h3>{w.name}</h3>
              <p className="caption">{w.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
