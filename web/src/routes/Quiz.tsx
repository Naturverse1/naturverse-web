import { useParams } from "react-router-dom";
import { byId, quizzes } from "../lib/content";

export default function Quiz(){
  const { id } = useParams();
  const doc = byId(quizzes, id);
  if(!doc) return <div className="container"><h1>Quiz</h1><p className="meta">Not found.</p></div>;
  return (
    <div className="container">
      <h1>{doc.title}</h1>
      <p className="meta">{doc.summary}</p>
      <hr/>
      <pre>{doc.body}</pre>
    </div>
  );
}
