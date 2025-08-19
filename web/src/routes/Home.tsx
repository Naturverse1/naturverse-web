import { Link } from "react-router-dom";
import { zones } from "../lib/content";

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome 🌿</h1>
      <p>Naturverse is live and the client router is working.</p>

      <h2>Explore</h2>
      <div className="nav">
        <Link to="/zones">Zones</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/arcade">Arcade</Link>
        <Link to="/worlds">Worlds</Link>
      </div>

      <h2>Zones (shortcuts)</h2>
      <div className="nav">
        {zones.map(z => (
          <Link key={z.slug} to={`/zones/${z.slug}`}>{z.title}</Link>
        ))}
      </div>

      <h2>Content</h2>
      <div className="nav">
        <Link to="/stories">Stories</Link>
        <Link to="/quizzes">Quizzes</Link>
        <Link to="/observations">Observations</Link>
        <Link to="/tips">Turian Tips</Link>
      </div>

      <h2>Account</h2>
      <div className="nav">
        <Link to="/profile">Profile & Settings</Link>
      </div>
    </div>
  );
}
