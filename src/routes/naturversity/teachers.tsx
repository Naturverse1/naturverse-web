import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";

export default function Teachers() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/naturversity", label: "Naturversity" }, { label: "Teachers" }]} />
      <SectionHero title="Teachers" subtitle="Educator resources and dashboards." emoji="🧑‍🏫" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page.</p>
      </div>
    </>
  );
}
