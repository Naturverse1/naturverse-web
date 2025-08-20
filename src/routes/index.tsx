import React from "react";
import SectionHero from "../components/common/SectionHero";
import HubGrid, { HubCard } from "../components/hubs/HubGrid";

export default function Home() {
  const hubs: HubCard[] = [
    { to: "/worlds", title: "Worlds", emoji: "🗺️", description: "Travel the 14 magical kingdoms." },
    { to: "/zones", title: "Zones", emoji: "🎮🎵🧘‍♀️", description: "Arcade, Music, Wellness, Creator Lab, Stories, Quizzes." },
    { to: "/marketplace", title: "Marketplace", emoji: "🛍️", description: "Wishlists, catalog, checkout." },
    { to: "/naturversity", title: "Naturversity", emoji: "🎓", description: "Teachers, partners, and courses." },
    { to: "/naturbank", title: "Naturbank", emoji: "🪙", description: "Wallets, NATUR token, and crypto basics." },
    { to: "/navatar", title: "Navatar", emoji: "🧩", description: "Create your character." },
    { to: "/passport", title: "Passport", emoji: "🛂", description: "Track stamps, badges, XP & coins." },
    { to: "/turian", title: "Turian", emoji: "🦔", description: "AI guide for tips & quests." },
    { to: "/profile", title: "Profile", emoji: "👤", description: "Your account and saved navatar." },
  ];

  return (
    <>
      <SectionHero title="Welcome to the Naturverse™" subtitle="Pick a hub to begin your adventure." emoji="✨" />
      <HubGrid items={hubs} />
    </>
  );
}
