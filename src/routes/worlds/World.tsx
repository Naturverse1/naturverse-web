import { useParams } from 'react-router-dom';
import { worlds } from '../../lib/routes';
import HubCard from '../../components/HubCard';
import HubGrid from '../../components/HubGrid';

export default function World() {
  const { slug } = useParams();
  const w = worlds.find((x) => x.slug === slug);
  if (!w) return <p className="text-gray-600">World not found.</p>;
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">
        {w.emoji} {w.title}
      </h2>
      <p className="text-gray-600">{w.blurb}</p>
      <HubGrid>
        <HubCard
          to="#"
          emoji="📖"
          title="Story Path"
          sub={`Begin an AI-guided story in ${w.title}.`}
        />
        <HubCard to="#" emoji="🎯" title="Quests" sub="Complete missions to earn stamps & XP." />
        <HubCard to="#" emoji="🖼️" title="Gallery" sub="Facts, animals, plants, foods." />
      </HubGrid>
    </section>
  );
}
