import { HubCard } from "../components/HubCard";
import { HubGrid } from "../components/HubGrid";

export default function Home() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">✨ Welcome to the Naturverse™</h1>
        <p className="text-gray-600 mt-1">Pick a hub to begin your adventure.</p>
      </header>
      <HubGrid>
        <HubCard to="/worlds"       title="Worlds"       desc="Travel the 14 magical kingdoms." emoji="📚" />
        <HubCard to="/zones"        title="Zones"        desc="Arcade, Music, Wellness, Creator Lab, Stories, Quizzes." emoji="🎮🎵🧘" />
        <HubCard to="/marketplace"  title="Marketplace"  desc="Wishlists, catalog, checkout." emoji="🛍️" />
        <HubCard to="/naturversity" title="Naturversity" desc="Teachers, partners, courses." emoji="🎓" />
        <HubCard to="/naturbank"    title="Naturbank"    desc="Wallets, NATUR token, and crypto basics." emoji="🪙" />
        <HubCard to="/navatar"      title="Navatar"      desc="Create your character." emoji="🧩" />
        <HubCard to="/passport"     title="Passport"     desc="Track stamps, badges, XP & coins." emoji="📘" />
        <HubCard to="/turian"       title="Turian"       desc="AI guide for tips & quests." emoji="🦉" />
        <HubCard to="/profile"      title="Profile"      desc="Your account & saved navatar." emoji="🧑‍🚀" />
      </HubGrid>
    </div>
  );
}
