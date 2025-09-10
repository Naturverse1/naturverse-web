import Breadcrumbs from '../../components/navatar/Breadcrumbs';
import NavTabs from '../../components/navatar/NavTabs';

export default function Marketplace() {
  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Breadcrumbs trail={[{ to: '/navatar', label: 'Navatar' }, { label: 'Marketplace' }]} />
      <h1 className="text-4xl font-bold text-blue-700 mb-2">Marketplace (Coming Soon)</h1>
      <NavTabs />
      <p className="text-blue-900 mb-4">Mockups and merch generator preview will appear here.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-gray-50 p-4 shadow h-64 flex items-end justify-center">
            <div className="mb-2 font-semibold text-blue-800">Coming soon</div>
          </div>
        ))}
      </div>
    </div>
  );
}

