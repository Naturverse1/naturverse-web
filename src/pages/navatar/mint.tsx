import Breadcrumbs from '../../components/navatar/Breadcrumbs';
import NavTabs from '../../components/navatar/NavTabs';
import { useNavatar } from '../../lib/navatar-context';
import { Link } from 'react-router-dom';

export default function NFTMint() {
  const { active, card } = useNavatar();

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Breadcrumbs trail={[{ to: '/navatar', label: 'Navatar' }, { label: 'NFT / Mint' }]} />
      <h1 className="text-4xl font-bold text-blue-700 mb-2">NFT / Mint</h1>
      <NavTabs />
      <p className="text-blue-900 mb-4">
        Coming soon: mint your Navatar on-chain. In the meantime, make merch with your Navatar on the Marketplace.
      </p>

      {!active ? (
        <div className="text-blue-800">Pick or upload a Navatar first.</div>
      ) : (
        <div className="rounded-2xl border bg-white p-4 shadow max-w-sm">
          <img src={active.image_url} alt={active.title} className="w-full rounded-xl" />
          <div className="text-center font-semibold text-blue-800 mt-2">{active.title}</div>
          {card && (
            <div className="text-blue-900 text-sm mt-3 space-y-1">
              <div><b>Name</b> {card.name}</div>
              <div><b>Species</b> {card.species}</div>
              <div><b>Kingdom</b> {card.kingdom}</div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <Link to="/navatar/marketplace" className="px-4 py-2 rounded-full bg-white text-blue-700 border">Go to Marketplace</Link>
      </div>
    </div>
  );
}

