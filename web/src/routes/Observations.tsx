import { Link } from "react-router-dom";
import { observations } from "../lib/content";

export default function Observations(){
  return (
    <div className="container">
      <h1>Observations</h1>
      <div className="list">
        {observations.map(o => (
          <div className="card" key={o.id}>
            <b><Link to={`/observations/${o.id}`}>{o.title}</Link></b>
            <div className="meta">{o.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
