import React from "react";
import { useParams } from "react-router-dom";
import { WORLDS } from "./data";

export default function World(){
  const { slug } = useParams();
  const w = WORLDS.find(x=>x.slug===slug);
  if(!w) return <p className="p">World not found.</p>;
  return (
    <section>
      <h1 className="h1">{w.icon} {w.title}</h1>
      <p className="p">{w.subtitle}</p>
      <div className="grid">
        <div className="card"><h3>Story Path</h3><div className="small">Begin an AI-guided story in {w.title}.</div></div>
        <div className="card"><h3>Quests</h3><div className="small">Complete missions to earn stamps & XP.</div></div>
        <div className="card"><h3>Gallery</h3><div className="small">Facts, animals, plants, foods.</div></div>
      </div>
    </section>
  );
}
