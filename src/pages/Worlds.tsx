import { WORLDS } from "../data/worlds";

export default function Worlds() {
  return (
    <section>
      <h2 className="h1">Worlds</h2>
      <div className="grid">
        {WORLDS.map(w => (
          <div key={w.name} className="card">
            <div style={{fontSize:24}}>{w.emoji}</div>
            <h3 style={{margin:"8px 0 4px"}}>{w.name}</h3>
            <div className="lead">{w.tagline}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

