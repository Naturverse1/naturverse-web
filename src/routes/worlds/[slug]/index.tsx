import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/common/Breadcrumbs";
import SectionHero from "../../../components/common/SectionHero";
import { WORLDS } from "../../../data/worlds";

export default function WorldDetail() {
  const { slug } = useParams();
  const world = WORLDS.find((w) => w.slug === slug);

  if (!world) {
    return (
      <>
        <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/worlds", label: "Worlds" }, { label: "Not found" }]} />
        <SectionHero title="World not found" emoji="❓" />
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { to: "/worlds", label: "Worlds" }, { label: world.name }]} />
      <SectionHero
        title={world.name}
        subtitle={`${world.fruit} & ${world.animal}`}
        emoji={world.emoji}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 48px" }}>
        <p>{world.blurb}</p>
      </div>
    </>
  );
}
