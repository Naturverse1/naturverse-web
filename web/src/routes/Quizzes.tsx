import { Link } from "react-router-dom";
import { quizzes } from "../lib/content";

export default function Quizzes(){
  return (
    <div className="container">
      <h1>Quizzes</h1>
      <div className="list">
        {quizzes.map(q => (
          <div className="card" key={q.id}>
            <b><Link to={`/quizzes/${q.id}`}>{q.title}</Link></b>
            <div className="meta">{q.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
