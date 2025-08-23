import React, { useEffect, useState } from "react";
import { HubGrid } from "../components/HubGrid";
import Meta from "../components/Meta";
import Breadcrumbs from "../components/Breadcrumbs";
import SkeletonGrid from "../components/SkeletonGrid";
import PageHead from "../components/PageHead";

export default function NaturversityPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);
  return (
      <>
        <PageHead title="Naturverse — Naturversity" description="Teachers, partners, and courses." />
        <div className="page-wrap">
          <Meta title="Naturversity — Naturverse" description="Teachers, partners, and courses." />
          <Breadcrumbs items={[{ href:"/", label:"Home" }, { label:"Naturversity" }]} />
          <main id="main">
          <h1>Naturversity</h1>
          <p className="muted">Teachers, partners, and courses.</p>

        {ready ? (
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
                  src="/favicon.png"
                  alt="Languages Icon"
                  className="w-6 h-6"
                />
              ),
            },
          ]}
        />
        ) : (
          <SkeletonGrid count={4} />
        )}

        <p className="muted" style={{ marginTop: 12 }}>
          Coming soon: AI tutors and step-by-step lessons.
        </p>
          </main>
        </div>
      </>
  );
}
