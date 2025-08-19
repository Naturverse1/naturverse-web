import { useParams } from "react-router-dom";
import { byId, tips } from "../lib/content";

export default function Tip(){
  const { id } = useParams();
  const doc = byId(tips, id);
  if(!doc) return <div className="container"><h1>Tip</h1><p className="meta">Not found.</p></div>;
  return (
    <div className="container">
      <h1>{doc.title}</h1>
      <p className="meta">{doc.summary}</p>
      <hr/>
      <div>{doc.body}</div>
    </div>
  );
}
