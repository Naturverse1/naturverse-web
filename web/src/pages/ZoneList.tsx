import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getZoneDocs } from "../lib/content";
import type { Doc } from "../types/content";

export default function ZoneList(){
  const { zone = "" } = useParams();
  const [docs,setDocs] = useState<Doc[]>([]);
  useEffect(()=>{ getZoneDocs(zone as any).then(setDocs); },[zone]);
  return (
    <main className="container">
      <h1>{zoneToTitle(zone)}</h1>
      <ul>
        {docs.map(d=>(
          <li key={d.slug}>
            <Link to={`/zones/${zone}/${d.slug}`}><strong>{d.title}</strong></Link>
            {d.summary ? <> — {d.summary}</> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
function zoneToTitle(z?: string){ return (z??"").split("-").map(s=>s[0]?.toUpperCase()+s.slice(1)).join(" "); }
