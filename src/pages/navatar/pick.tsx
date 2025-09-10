import Breadcrumbs from '../../components/navatar/Breadcrumbs';
import NavTabs from '../../components/navatar/NavTabs';
import { useNavatar } from '../../lib/navatar-context';

// IMPORTANT: images live under /public/navatars
const NAVATAR_IMAGES = import.meta.glob('/public/navatars/*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });

type Item = { title: string; url: string };

const data: Item[] = Object.entries(NAVATAR_IMAGES).map(([path, url]) => {
  const file = path.split('/').pop()!;
  const title = file.replace(/\.[^.]+$/, '');
  // public URL path for <img src>, remove /public
  const publicUrl = `/navatars/${file}`;
  return { title, url: publicUrl };
}).sort((a, b) => a.title.localeCompare(b.title));

export default function Pick() {
  const { setActiveFromPick } = useNavatar();

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Breadcrumbs trail={[{ to: '/navatar', label: 'Navatar' }, { label: 'Pick' }]} />
      <h1 className="text-4xl font-bold text-blue-700 mb-2">Pick Navatar</h1>
      <NavTabs />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {data.map(item => (
          <button
            key={item.url}
            className="rounded-2xl border bg-white shadow hover:shadow-md transition p-2"
            onClick={async () => {
              await setActiveFromPick(item.title, item.url);
              alert('Selected!');
            }}
          >
            <img src={item.url} alt={item.title} className="w-full h-auto rounded-lg" />
            <div className="text-center font-semibold text-blue-800 mt-1">{item.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

