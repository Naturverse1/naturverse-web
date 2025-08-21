import { HubCard } from "../../components/HubCard";
import { HubGrid } from "../../components/HubGrid";

export default function Zones() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Zones</h2>
      <HubGrid>
        <HubCard title="Arcade"       desc="Mini-games, leaderboards & tournaments." emoji="🕹️" />
        <HubCard title="Music"        desc="Karaoke, AI beats & song maker."          emoji="🎤🎵" />
        <HubCard title="Wellness"     desc="Yoga, breathing, stretches, mindful quests." emoji="🧘" />
        <HubCard title="Creator Lab"  desc="AI art & character cards."                 emoji="🎨🤖" />
        <HubCard title="Stories"      desc="AI story paths set in all 14 kingdoms."    emoji="📚✨" />
        <HubCard title="Quizzes"      desc="Solo & party quiz play with scoring."      emoji="🎯" />
        <HubCard title="Observations" desc="Upload nature pics; tag, learn, earn."     emoji="📷🌿" />
      </HubGrid>
    </section>
  );
}
