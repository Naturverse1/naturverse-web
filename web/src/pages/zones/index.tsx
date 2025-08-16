import React from "react";
import ZoneTile from '../../components/ZoneTile';

export default function ZonesHub() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pt-10 pb-4 text-white">
      <h1 className="text-4xl font-bold">Choose Your Zone</h1>
      <p className="mt-2 text-white/80">Learn, create, and play—your way.</p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ZoneTile
          to="/zones/naturversity"
          title="Naturversity"
          blurb="Guided lessons, quests, and projects."
          emoji="📚"
          accent="#7dd3fc"
        />
        <ZoneTile
          to="/zones/music"
          title="Music Zone"
          blurb="Mood playlists and loop maker."
          emoji="🎵"
          accent="#a78bfa"
        />
        <ZoneTile
          to="/zones/wellness"
          title="Wellness"
          blurb="Check-ins and breath timers."
          emoji="🌿"
          accent="#34d399"
        />
        <ZoneTile
          to="/zones/creator-lab"
          title="Creator Lab"
          blurb="Stories, characters, and worlds."
          emoji="🧪"
          accent="#f472b6"
        />
        <ZoneTile
          to="/zones/arcade"
          title="Arcade"
          blurb="Quick mini-games."
          emoji="🕹️"
          accent="#f59e0b"
        />
        <ZoneTile
          to="/zones/community"
          title="Community"
          blurb="News and safe-space tips."
          emoji="🌈"
          accent="#60a5fa"
        />
        <ZoneTile
          to="/zones/eco-lab"
          title="Eco Lab"
          blurb="Hands-on mini experiments and nature observations."
          emoji="🌱"
          accent="#4ade80"
        />
        <ZoneTile
          to="/zones/story-studio"
          title="Story Studio"
          blurb="Write and illustrate short adventures."
          emoji="✍️"
          accent="#f9a8d4"
        />
        <ZoneTile
          to="/zones/parents"
          title="Parents & Teachers"
          blurb="Tips, progress exporting, and classroom ideas."
          emoji="👪"
          accent="#fde68a"
        />
        <ZoneTile
          to="/zones/settings"
          title="Settings"
          blurb="Theme, accessibility, and account options."
          emoji="⚙️"
          accent="#94a3b8"
        />
      </div>
      <p className="mt-6 text-[13px] text-white/70">
        Tip: toggle 'Starfield' and 'Reduce motion' in Settings to match your device.
      </p>
    </main>
  );
}
