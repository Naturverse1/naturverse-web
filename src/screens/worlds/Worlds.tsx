import React from "react";
import { Link } from "react-router-dom";
import { WORLDS } from "./data";

export default function Worlds(){
  return (
    <section>
      <h1 className="h1">Worlds</h1>
      <div className="grid">
        {WORLDS.map(w=>(
          <Link key={w.slug} to={`/worlds/${w.slug}`} className="card">
            <h3>{w.icon} {w.title}</h3>
            <div className="small">{w.subtitle}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
