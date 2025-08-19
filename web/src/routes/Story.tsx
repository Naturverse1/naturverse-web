import { useParams } from "react-router-dom";
import { byId, stories } from "../lib/content";

export default function Story(){
  const { id } = useParams();
  const doc = byId(stories, id);
  if(!doc) return <div className="container"><h1>Story</h1><p className="meta">Not found.</p></div>;
  return (
    <div className="container">
      <h1>{doc.title}</h1>
      <p className="meta">{doc.summary}</p>
      <hr/>
      <div>{doc.body}</div>
    </div>
  );
}
