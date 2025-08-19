import { Link } from "react-router-dom";
import { tips } from "../lib/content";

export default function Tips(){
  return (
    <div className="container">
      <h1>Turian Tips</h1>
      <div className="list">
        {tips.map(t => (
          <div className="card" key={t.id}>
            <b><Link to={`/tips/${t.id}`}>{t.title}</Link></b>
            <div className="meta">{t.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
