import React from "react";
import Breadcrumbs from "../components/common/Breadcrumbs";
import SectionHero from "../components/common/SectionHero";

export default function NavatarPage() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Navatar" }]} />
      <SectionHero title="Navatar Creator" subtitle="Build your character." emoji="🧩" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub page.</p>
      </div>
    </>
  );
}
