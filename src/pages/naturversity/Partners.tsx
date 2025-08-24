import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { PARTNERS } from "../../lib/naturversity/data";

export default function Partners() {
  return (
    <div className="page-wrap">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Naturversity", href: "/naturversity" },
          { label: "Partners" },
        ]}
      />
      <main id="main" className="page">
        <h1>🤝 Partners</h1>
        <div className="edu-list">
          {PARTNERS.map(p => (
            <div key={p.id} className="edu-row">
              <div className="badge">Partner</div>
              <div className="grow">
                <div className="title">{p.name}</div>
                <div className="desc">{p.focus}</div>
              </div>
              <button className="btn tiny outline" disabled>Visit (soon)</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

