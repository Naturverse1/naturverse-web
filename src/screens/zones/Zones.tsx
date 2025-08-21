import React from "react";
import { Link } from "react-router-dom";
import { ZONES } from "./data";

export default function Zones(){
  return (
    <section>
      <h1 className="h1">Zones</h1>
      <div className="grid">
        {ZONES.map(z=>(
          <Link key={z.slug} to={`/zones/${z.slug}`} className="card">
            <h3>{z.icon} {z.title}</h3>
            <div className="small">{z.blurb}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
