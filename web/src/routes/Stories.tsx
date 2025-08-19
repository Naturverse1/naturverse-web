import { Link } from "react-router-dom";
import { stories } from "../lib/content";

export default function Stories(){
  return (
    <div className="container">
      <h1>Stories</h1>
      <p className="meta">Stories library.</p>
      <div className="list">
        {stories.map(s => (
          <div className="card" key={s.id}>
            <b><Link to={`/stories/${s.id}`}>{s.title}</Link></b>
            <div className="meta">{s.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
