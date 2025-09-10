import Breadcrumbs from '../../components/navatar/Breadcrumbs';
import NavTabs from '../../components/navatar/NavTabs';
import { useNavatar } from '../../lib/navatar-context';
import { Link } from 'react-router-dom';

export default function MyNavatar() {
  const { active, card } = useNavatar();

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Breadcrumbs trail={[{ label: 'Navatar' }]} />
      <h1 className="text-4xl font-bold text-blue-700 mb-2">My Navatar</h1>
      <NavTabs />

      {!active ? (
        <div className="mt-6 rounded-2xl border bg-white p-4 shadow">
          <div className="text-blue-800">No Navatar yet.</div>
          <div className="mt-2 flex gap-2">
            <Link to="/navatar/pick" className="px-4 py-2 bg-blue-600 text-white rounded-full">Pick</Link>
            <Link to="/navatar/upload" className="px-4 py-2 bg-white text-blue-700 border rounded-full">Upload</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-white p-2 shadow">
            <img src={active.image_url} alt={active.title} className="w-full rounded-xl" />
            <div className="text-center font-semibold text-blue-800 mt-2">{active.title}</div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow">
            <div className="text-xl font-semibold text-blue-800 mb-2">Character Card</div>
            {!card ? (
              <div className="text-blue-700">
                No card yet. <Link to="/navatar/card" className="underline">Create Card</Link>
              </div>
            ) : (
              <div className="text-blue-900 space-y-1">
                <div><span className="font-semibold">Name</span><div>{card.name}</div></div>
                <div><span className="font-semibold">Species</span><div>{card.species}</div></div>
                <div><span className="font-semibold">Kingdom</span><div>{card.kingdom}</div></div>
                <div><span className="font-semibold">Backstory</span><div>{card.backstory}</div></div>
                {!!card.powers?.length && (
                  <div><span className="font-semibold">Powers</span><div>— {card.powers.join(', ')}</div></div>
                )}
                {!!card.traits?.length && (
                  <div><span className="font-semibold">Traits</span><div>— {card.traits.join(', ')}</div></div>
                )}
                <Link to="/navatar/card" className="inline-block mt-2 px-4 py-2 rounded-full bg-blue-600 text-white">Edit Card</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

