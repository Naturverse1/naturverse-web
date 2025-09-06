import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Pills } from '../../components/navatar/Pills';
import { CardFrame } from '../../components/navatar/CardFrame';
import { loadPublicNavatars, PublicNavatar } from '../../lib/navatar/publicList';
import { saveUserNavatar } from '@/lib/supabase/navatar';
import { useAuth } from '@/lib/auth-context';
import '../../styles/navatar.css';

export default function PickNavatarPage() {
  const [items, setItems] = useState<PublicNavatar[]>([]);
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadPublicNavatars().then(setItems);
  }, []);

  async function choose(src: string, name: string) {
    if (!user) return;
    const res = await fetch(src);
    const blob = await res.blob();
    const file = new File([blob], 'pick.png', { type: blob.type });
    await saveUserNavatar(user.id, file, name);
    nav('/navatar');
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/navatar', label: 'Navatar' }, { label: 'Pick' }]} />
      <h1 className="nv-heading">Pick Navatar</h1>
      <Pills hub="navatar" active="pick" hideOnMobileSubpages />
      <div className="nav-grid">
        {items.map((it) => (
          <button
            key={it.src}
            className="linklike"
            onClick={() => choose(it.src, it.name)}
            aria-label={`Pick ${it.name}`}
            style={{ background: 'none', border: 0, padding: 0, textAlign: 'inherit' }}
          >
            <CardFrame title={it.name}>
              <img src={it.src} alt={it.name} />
            </CardFrame>
          </button>
        ))}
      </div>
    </main>
  );
}

