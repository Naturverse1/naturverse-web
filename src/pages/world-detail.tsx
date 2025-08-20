import { useParams } from 'react-router-dom';
import { worldsData } from '../content/worlds/worlds.data';

export default function WorldDetail() {
  const { slug } = useParams();
  const world = worldsData.find(w => w.slug === slug);
  if (!world) return <div className="p-4">World not found.</div>;
  return (
    <div className="container mx-auto p-4">
      <h1>{world.name}</h1>
      <p className="opacity-80">{world.subtitle} • {world.emojis.join(' ')}</p>
      {world.banner && <img src={world.banner} alt="" className="mt-4 rounded-lg w-full max-h-72 object-cover" />}
      <h3 className="mt-6 text-lg">Main Character</h3>
      <div className="flex items-center gap-3 mt-2">
        {world.main.image && <img src={world.main.image} alt={world.main.name} className="h-14 w-14 rounded-full object-cover" />}
        <div><div className="font-medium">{world.main.name}</div><div className="opacity-70">{world.main.emoji ?? ''}</div></div>
      </div>
      {world.cast.length > 0 && (
        <>
          <h3 className="mt-6 text-lg">Supporting Cast</h3>
          <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {world.cast.map(c => (
              <li key={c.id} className="flex items-center gap-3 border rounded p-3">
                {c.image && <img src={c.image} alt={c.name} className="h-12 w-12 rounded-full object-cover" />}
                <div>
                  <div className="font-medium">{c.name} {c.emoji ?? ''}</div>
                  {c.zone && <div className="text-xs opacity-70">Zone: {c.zone}</div>}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {world.map && (
        <>
          <h3 className="mt-6 text-lg">Map</h3>
          <img src={world.map} alt={`${world.name} map`} className="mt-2 rounded-lg w-full" />
        </>
      )}
    </div>
  );
}

