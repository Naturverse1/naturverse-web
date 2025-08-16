import React from "react";
import ZoneCard from "@/components/ZoneCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function ZonesHub() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-white">
      <Breadcrumbs items={[{ label: "Naturverse" }, { label: "Home", to: "/" }, { label: "Zones" }]} />
      <h1 className="text-3xl font-bold">Zones</h1>
      <p className="text-white/80 mt-2">Pick a zone to explore. We’ll keep polishing each one.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ZoneCard
          to="/zones/naturversity"
          title="Naturversity"
          blurb="Guided lessons, quests, and projects. Tracks your progress."
          emoji="📚"
        />
        <ZoneCard
          to="/zones/music"
          title="Music Zone"
          blurb="Make loops, layer beats, and learn rhythm."
          emoji="🎵"
        />
        <ZoneCard
          to="/zones/wellness"
          title="Wellness Zone"
          blurb="Daily check-ins, mindful breaths, tiny movement breaks."
          emoji="🌿"
        />
        <ZoneCard
          to="/zones/creator-lab"
          title="Creator Lab"
          blurb="Write stories, design characters, and craft worlds."
          emoji="🧪"
        />
        <ZoneCard
          to="/zones/arcade"
          title="Arcade"
          blurb="Quick learning mini-games. More coming soon!"
          emoji="🕹️"
        />
        <ZoneCard
          to="/zones/community"
          title="Community"
          blurb="Updates, highlights, and safe-space guidelines."
          emoji="🌈"
        />
        <ZoneCard
          to="/zones/eco-lab"
          title="Eco Lab"
          blurb="Hands-on mini experiments and nature observations."
          emoji="🌱"
        />
        <ZoneCard
          to="/zones/story-studio"
          title="Story Studio"
          blurb="Write and illustrate short adventures."
          emoji="✍️"
        />
        <ZoneCard
          to="/zones/parents"
          title="Parents & Teachers"
          blurb="Tips, progress exporting, and classroom ideas."
          emoji="👪"
        />
        <ZoneCard
          to="/zones/settings"
          title="Settings"
          blurb="Theme, accessibility, and account options."
          emoji="⚙️"
        />
      </div>
    </main>
  );
}
