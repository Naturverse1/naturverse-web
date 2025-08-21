import { HubCard } from "../../components/HubCard";
import { HubGrid } from "../../components/HubGrid";
import { zones } from "../../lib/routes";

export default function Zones() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Zones</h2>
      <HubGrid>
        {zones.map(z => (
          <HubCard key={z.slug} to={`/zones/${z.slug}`} title={z.title} desc={z.blurb} emoji={z.emoji} />
        ))}
      </HubGrid>
    </section>
  );
}
