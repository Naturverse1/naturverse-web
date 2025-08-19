import { games } from "../lib/content";

export default function Arcade(){
  return (
    <div className="container">
      <h1>Arcade</h1>
      <ul>
        {games.map(g => (
          <li key={g.id}><a href={g.url}>{g.title}</a> — <span className="meta">{g.description}</span></li>
        ))}
      </ul>
      <hr/>
      <p className="meta">High scores & leaderboard endpoints can be attached later.</p>
    </div>
  );
}
