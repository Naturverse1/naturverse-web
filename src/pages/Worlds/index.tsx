import { worldsData } from '../../content/worlds/worlds.data';
import WorldCard from '../../components/worlds/WorldCard';

export default function Worlds() {
  const avail = worldsData.filter(w => w.status === 'available');
  const soon = worldsData.filter(w => w.status === 'coming-soon');
  return (
    <div className="container mx-auto p-4">
      <h1>Worlds</h1>
      <p className="opacity-80">Explore the 14 kingdoms of the Naturverse™.</p>
      <h2 className="mt-6 mb-2 text-xl">Available</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {avail.map(w => <WorldCard key={w.slug} w={w} />)}
      </div>
      {soon.length > 0 && (
        <>
          <h2 className="mt-8 mb-2 text-xl">Coming Soon</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {soon.map(w => <WorldCard key={w.slug} w={w} />)}
          </div>
        </>
      )}
    </div>
  );
}

