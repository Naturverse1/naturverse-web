import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";
import HubGrid from "../../components/hubs/HubGrid";

export default function NaturversityHub() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Naturversity" }]} />
      <SectionHero title="Naturversity" subtitle="Teachers, partners, and courses." emoji="🎓" />
      <HubGrid
        items={[
          { to: "/naturversity/teachers", title: "Teachers", emoji: "🧑‍🏫", description: "Profiles and resources." },
          { to: "/naturversity/partners", title: "Partners", emoji: "🤝", description: "Organizations and creators." },
          { to: "/naturversity/courses", title: "Courses", emoji: "📚", description: "Coming soon." },
        ]}
      />
    </>
  );
}
