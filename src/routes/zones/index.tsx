import React from "react";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import SectionHero from "../../components/common/SectionHero";
import HubGrid from "../../components/hubs/HubGrid";

export default function ZonesHub() {
  return (
    <>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Zones" }]} />
      <SectionHero title="Zones" subtitle="Play, learn, and create." emoji="🎯" />
      <HubGrid
        items={[
          { to: "/zones/arcade", title: "Arcade", emoji: "🎮", description: "Games hub." },
          { to: "/zones/music", title: "Music", emoji: "🎵", description: "Tunes & playlists." },
          { to: "/zones/wellness", title: "Wellness", emoji: "🧘‍♀️", description: "Mind & body." },
          { to: "/zones/creator-lab", title: "Creator Lab", emoji: "🧪", description: "Make & share." },
          { to: "/zones/stories", title: "Stories", emoji: "📖", description: "Interactive tales." },
          { to: "/zones/quizzes", title: "Quizzes", emoji: "🧠", description: "Test your knowledge." },
        ]}
      />
    </>
  );
}
