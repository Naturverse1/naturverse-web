import { HubCard } from "../components/HubCard";
import { HubGrid } from "../components/HubGrid";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">✨ Welcome to the Naturverse™</h1>
        <p className="text-gray-600 mt-1">Pick a hub to begin your adventure.</p>
      </header>

      <HubGrid>
        <Link to="/worlds"><HubCard title="Worlds" desc="Travel the 14 magical kingdoms." emoji="📚" /></Link>
        <Link to="/zones"><HubCard title="Zones" desc="Arcade, Music, Wellness, Creator Lab, Stories, Quizzes." emoji="🎮🎵🧘" /></Link>
        <Link to="/marketplace"><HubCard title="Marketplace" desc="Wishlists, catalog, checkout." emoji="🛍️" /></Link>
        <Link to="/naturversity"><HubCard title="Naturversity" desc="Teachers, partners, courses." emoji="🎓" /></Link>
        <Link to="/naturbank">
          <HubCard title="Naturbank" desc="Wallets, NATUR token, and crypto basics." emoji="🪙" />
        </Link>
        <Link to="/navatar"><HubCard title="Navatar" desc="Create your character." emoji="🧩" /></Link>
        <Link to="/passport"><HubCard title="Passport" desc="Track stamps, badges, XP & coins." emoji="📘" /></Link>
        <Link to="/turian"><HubCard title="Turian" desc="AI guide for tips & quests." emoji="🦉" /></Link>
        <Link to="/profile"><HubCard title="Profile" desc="Your account & saved navatar." emoji="🧑‍🚀" /></Link>
      </HubGrid>
    </div>
  );
}
