import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { ZONES } from "../../data/zones";
import { setTitle } from "../../pages/_meta";

export default function Zones() {
  setTitle("Zones");
    return (
      <div className="zones-page">
        <Breadcrumbs />
        <h1>Zones</h1>
        <div className="cards grid-gap">
        {ZONES.map((z) => (
          <a key={z.href} className="card" href={z.href}>
            <h2>{z.title}</h2>
            <p>{z.blurb}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
