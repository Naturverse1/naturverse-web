import { Link } from "react-router-dom";
import { zones } from "../lib/content";

export default function Zones() {
  return (
    <div className="container">
      <h1>Zones</h1>
      <div className="list">
        {zones.map(z => (
          <div className="card" key={z.slug}>
            <b><Link to={`/zones/${z.slug}`}>{z.title}</Link></b>
            <div className="meta">{z.tagline}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
