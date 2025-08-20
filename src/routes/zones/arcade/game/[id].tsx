import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../../components/common/Breadcrumbs";
import SectionHero from "../../../../components/common/SectionHero";

export default function GameDetail() {
  const { id } = useParams();
  return (
    <>
      <Breadcrumbs items={[
        { to: "/", label: "Home" },
        { to: "/zones", label: "Zones" },
        { to: "/zones/arcade", label: "Arcade" },
        { label: String(id) }
      ]} />
      <SectionHero title={`Game: ${id}`} subtitle="Game placeholder" emoji="🕹️" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>Stub. Load game canvas or iframe here later.</p>
      </div>
    </>
  );
}
