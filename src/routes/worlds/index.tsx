import { HubCard } from "../../components/HubCard";
import { HubGrid } from "../../components/HubGrid";
import { worlds } from "../../lib/routes";

export default function Worlds() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Worlds</h2>
      <p className="text-gray-600">Explore the 14 kingdoms.</p>
      <HubGrid>
        {worlds.map(w => (
          <HubCard key={w.slug} to={`/worlds/${w.slug}`} title={w.title} desc={w.blurb} emoji={w.emoji} />
        ))}
      </HubGrid>
      <p className="text-xs text-gray-500 mt-4">Tip: Click any world to view.</p>
    </section>
  );
}
