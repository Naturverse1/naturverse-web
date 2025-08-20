import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDoc } from "../lib/content";
import type { Doc } from "../types/content";

export default function ZoneDoc(){
  const { zone = "", slug = "" } = useParams();
  const [doc,setDoc] = useState<Doc>();
  useEffect(()=>{ getDoc(zone as any, slug).then(setDoc); },[zone,slug]);

  if(!doc) return <main className="container"><p>Loading…</p></main>;
  return (
    <main className="container">
      <p><Link to={`/zones/${zone}`}>← Back to {zone}</Link></p>
      <h1>{doc.title}</h1>
      {doc.cover && <img src={doc.cover} alt="" style={{maxWidth:"320px"}} />}
      {doc.body && <div dangerouslySetInnerHTML={{__html: doc.body}} />}
      {doc.data && (
        <pre style={{background:"#f6f6f6", padding:"1rem", borderRadius:8}}>
          {JSON.stringify(doc.data, null, 2)}
        </pre>
      )}
    </main>
  );
}
