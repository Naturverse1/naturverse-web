import React from "react";
import { HubGrid } from "../components/HubGrid";
import Meta from "../components/Meta";
import Breadcrumbs from "../components/Breadcrumbs";

export default function NaturversityPage() {
  return (
      <>
        <div className="page-wrap">
          <Meta title="Naturversity — Naturverse" description="Teachers, partners, and courses." />
          <Breadcrumbs items={[{ href:"/", label:"Home" }, { label:"Naturversity" }]} />
          <main id="main">
          <h1>Naturversity</h1>
          <p className="muted">Teachers, partners, and courses.</p>

        <HubGrid
          items={[
            { to: "/naturversity/teachers", title: "Teachers", desc: "Mentors across the 14 kingdoms.", icon: "🎓" },
            { to: "/naturversity/partners", title: "Partners", desc: "Brands & orgs supporting missions.", icon: "🤝" },
            {
              to: "/naturversity/courses",
              title: "Courses",
              desc: "Nature, art, music, wellness, crypto basics.",
              icon: "📚",
            },
            {
              to: "/naturversity/languages",
              title: "Languages",
              desc: "Phrasebooks for each kingdom.",
              icon: (
                  <img
                    src="/assets/amerilandia/flag.png"
                    alt=""
                    width={24}
                    height={16}
                    loading="lazy"
                    style={{ borderRadius: 3 }}
                  />
              ),
            },
          ]}
        />

        <p className="muted" style={{ marginTop: 12 }}>
          Coming soon: AI tutors and step-by-step lessons.
        </p>
          </main>
        </div>
      </>
  );
}
