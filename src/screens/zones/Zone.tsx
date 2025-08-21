import React from "react";
import { useParams } from "react-router-dom";
import { ZONES } from "./data";

export default function Zone(){
  const { slug } = useParams();
  const z = ZONES.find(x=>x.slug===slug);
  if(!z) return <p className="p">Zone not found.</p>;
  return (
    <section>
      <h1 className="h1">{z.icon} {z.title}</h1>
      <p className="p">{z.blurb}</p>
      <div className="grid">
        <div className="card"><h3>Featured</h3><div className="small">Starter activity for {z.title}.</div></div>
        <div className="card"><h3>Coming Soon</h3><div className="small">More tools will appear here.</div></div>
      </div>
    </section>
  );
}
